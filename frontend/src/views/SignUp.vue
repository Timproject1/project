<script setup>
import { ref, watch, nextTick } from "vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialRadio from "@/components/MaterialRadio.vue";

// --- 데이터 상태 ---
const id = ref("");
const password = ref("");
const pwcheck = ref("");
const name = ref("");
const tel = ref("");
const email = ref("");
const center = ref("");

const zipCode = ref("");
const address = ref("");
const detailAddress = ref("");
const grade = ref("user");

const isCenterModalOpen = ref(false);
const searchKeyword = ref("");
const centerList = ref([]);
const isSearching = ref(false);

const idError = ref(false);
const pwError = ref(false);

// --- 함수 ---

// 1. 아이디 중복확인
const checkIdDuplicate = () => {
  if (!id.value) return;
  idError.value = id.value === "admin";
  if (!idError.value) alert("사용 가능한 아이디입니다.");
};

// 2. 카카오 주소 검색 (팝업 방식 - 우편번호 자동입력)
const openAddressSearch = () => {
  if (!window.daum || !window.daum.Postcode) {
    alert("라이브러리를 로드 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  new window.daum.Postcode({
    oncomplete: (data) => {
      // 주소와 우편번호 입력
      address.value = data.roadAddress || data.jibunAddress;
      zipCode.value = data.zonecode;

      // 상세 주소로 포커스 이동
      nextTick(() => {
        const detailInput = document.querySelector(
          'input[placeholder="상세 주소를 입력하세요"]',
        );
        if (detailInput) detailInput.focus();
      });
    },
    width: "100%",
    height: "100%",
  }).open(); // .open()을 사용하여 팝업창으로 띄움
};

// 3. 기관 검색 (백엔드 연결 수정)
const searchCenter = async () => {
  if (!searchKeyword.value.trim()) return alert("기관명을 입력하세요.");
  isSearching.value = true;
  centerList.value = [];

  try {
    const response = await fetch(
      `http://localhost:3000/center/list?keyword=${encodeURIComponent(
        searchKeyword.value,
      )}`,
    );
    if (response.ok) {
      centerList.value = await response.json();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error("검색 에러:", error);
    alert("서버 연결에 실패했습니다.");
  } finally {
    isSearching.value = false;
  }
};

const selectCenter = (selectedName) => {
  center.value = selectedName;
  isCenterModalOpen.value = false;
};

// 4. 가입하기 (서버 전송 로직 적용)
const signUp = async () => {
  if (password.value !== pwcheck.value) {
    pwError.value = true;
    return;
  }

  const signUpData = {
    userId: id.value,
    userPw: password.value,
    userName: name.value,
    userTel: tel.value,
    userEmail: email.value,
    userGrade: grade.value,
    zipCode: zipCode.value,
    address: address.value,
    detailAddress: detailAddress.value,
    centerName: center.value,
  };

  try {
    const response = await fetch("http://localhost:3000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUpData),
    });

    if (response.ok) {
      alert(`${name.value}님, 회원가입이 완료되었습니다!`);
    } else {
      alert("회원가입에 실패했습니다.");
    }
  } catch (error) {
    console.error("가입 에러:", error);
    alert("서버와 통신할 수 없습니다.");
  }
};

watch([id, password, pwcheck], () => {
  idError.value = false;
  pwError.value = false;
});
</script>

<template>
  <div class="signup-container">
    <div class="signup-card">
      <form @submit.prevent="signUp">
        <div class="field-row">
          <label class="field-label">회원 구분</label>
          <div class="field-body">
            <div class="input-group-custom radio-group">
              <material-radio
                id="user"
                name="grade"
                value="user"
                v-model:checked="grade"
                >일반사용자</material-radio
              >
              <material-radio
                id="admin"
                name="grade"
                value="admin"
                v-model:checked="grade"
                >기관담당자</material-radio
              >
            </div>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">아이디</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input v-model:value="id" class="flex-input" />
              <span class="required-tag">(필수)</span>
              <material-button
                color="success"
                size="sm"
                class="action-btn"
                @click="checkIdDuplicate"
                >중복 확인</material-button
              >
            </div>
            <p v-if="idError" class="error-msg">
              * 사용할 수 없는 아이디입니다.
            </p>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">비밀번호</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input
                v-model:value="password"
                type="password"
                class="flex-input"
              />
              <span class="required-tag">(필수)</span>
              <div class="btn-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">비밀번호 확인</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input
                v-model:value="pwcheck"
                type="password"
                class="flex-input"
              />
              <span class="required-tag">(필수)</span>
              <div class="btn-placeholder"></div>
            </div>
            <p v-if="pwError" class="error-msg">
              * 비밀번호가 일치하지 않습니다.
            </p>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">이름</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input v-model:value="name" class="flex-input" />
              <span class="required-tag">(필수)</span>
              <div class="btn-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">연락처</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input v-model:value="tel" class="flex-input" />
              <span class="required-tag">(필수)</span>
              <div class="btn-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">이메일</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input v-model:value="email" class="flex-input" />
              <span class="required-tag">(필수)</span>
              <div class="btn-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">주소</label>
          <div class="field-body">
            <div class="input-group-custom mb-2">
              <material-input
                v-model:value="address"
                class="flex-input cursor-pointer"
                placeholder="클릭하여 주소 검색"
                readonly
                @click="openAddressSearch"
              />
              <span class="required-tag">(필수)</span>
              <material-button
                color="success"
                size="sm"
                class="action-btn"
                @click="openAddressSearch"
                >검색</material-button
              >
            </div>
            <div class="input-group-custom mb-2">
              <material-input
                v-model:value="zipCode"
                class="zip-input"
                placeholder="우편번호"
                readonly
              />
              <div class="btn-placeholder-with-tag"></div>
            </div>
            <div class="input-group-custom">
              <material-input
                v-model:value="detailAddress"
                class="flex-input"
                placeholder="상세 주소를 입력하세요"
              />
              <div class="btn-placeholder-with-tag"></div>
            </div>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label">기관명</label>
          <div class="field-body">
            <div class="input-group-custom">
              <material-input
                v-model:value="center"
                class="flex-input cursor-pointer"
                placeholder="기관 검색 버튼을 눌러주세요"
                readonly
                @click="isCenterModalOpen = true"
              />
              <span class="required-tag">(필수)</span>
              <material-button
                color="success"
                size="sm"
                class="action-btn"
                @click="isCenterModalOpen = true"
                >기관 검색</material-button
              >
            </div>
          </div>
        </div>

        <div class="submit-row">
          <material-button
            type="submit"
            color="success"
            variant="gradient"
            size="lg"
            >가입하기</material-button
          >
        </div>
      </form>
    </div>

    <div v-if="isCenterModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h5 class="mb-4">기관 검색</h5>
        <div class="d-flex gap-2 mb-3">
          <material-input
            v-model:value="searchKeyword"
            class="flex-grow-1"
            placeholder="기관명 입력"
            @keyup.enter="searchCenter"
          />
          <material-button color="success" size="sm" @click="searchCenter"
            >검색</material-button
          >
        </div>
        <div class="result-area">
          <div v-if="isSearching" class="text-center p-3">검색 중...</div>
          <ul
            v-else-if="centerList.length > 0"
            class="list-group list-group-flush"
          >
            <li
              v-for="c in centerList"
              :key="c.center_name"
              class="list-group-item list-group-item-action cursor-pointer"
              @click="selectCenter(c.center_name)"
            >
              <div class="fw-bold">{{ c.center_name }}</div>
              <small class="text-muted">{{ c.address }}</small>
            </li>
          </ul>
          <div v-else class="text-center p-3 text-muted">결과가 없습니다.</div>
        </div>
        <div class="text-end mt-3">
          <material-button
            color="secondary"
            size="sm"
            variant="outline"
            @click="isCenterModalOpen = false"
            >취소</material-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 그대로 유지 */
.signup-container {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
  background-color: #fff;
}
.signup-card {
  width: 100%;
  max-width: 800px;
}


.list-group-item {
  cursor: pointer;
  transition: background 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

/* 시안의 레이아웃을 위한 스타일 */
.field-row {
  display: flex;
  margin-bottom: 25px;
  align-items: flex-start;
}
.field-label {
  width: 150px;
  min-width: 150px;
  font-weight: 700;
  color: #344767;
  padding-top: 10px;
}
.field-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.input-group-custom {
  display: flex;
  align-items: center;
  gap: 15px;
}
.radio-group {
  gap: 30px;
}
.flex-input {
  flex: 1;
}
.action-btn {
  width: 110px;
  height: 40px;
  margin: 0 !important;
}
.required-tag {
  color: #f44335;
  font-size: 0.85rem;
  width: 50px;
  white-space: nowrap;
}
.zip-input {
  width: 120px;
  flex: none !important;
}
.btn-placeholder-with-tag {
  width: 175px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 450px;
}
.result-area {
  border: 1px solid #eee;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}
.cursor-pointer {
  cursor: pointer;
}
.submit-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}
.mb-2 {
  margin-bottom: 10px !important;
}
.error-msg {
  color: #f44335;
  font-size: 0.85rem;
  margin-top: 8px;
}
</style>
