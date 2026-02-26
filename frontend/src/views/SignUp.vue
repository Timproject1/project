<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialRadio from "@/components/MaterialRadio.vue";

// 데이터 상태 관리
const userGrade = ref("a1");
const userId = ref("");
const userPw = ref("");
const userPwCheck = ref("");
const userName = ref("");
const userTel = ref("");
const userEmail = ref("");
const zipCode = ref("");
const userAddress = ref("");
const detailAddress = ref("");
const centerName = ref("");

const isAddressVisible = ref(false);

//아이디 중복 확인
const checkIdDuplication = async () => {
  if (!userId.value) {
    alert("아이디를 입력해주세요.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/user/check-id", {
      userId: userId.value,
    });

    if (response.data.isDuplicate) {
      alert("이미 사용 중인 아이디입니다.");
    } else {
      alert("사용 가능한 아이디입니다.");
    }
  } catch (error) {
    console.error("중복 확인 에러:", error);
    alert("서버 연결에 실패했습니다.");
  }
};

// 주소 검색 (카카오 API)
const openPostcode = () => {
  isAddressVisible.value = !isAddressVisible.value;
  if (isAddressVisible.value) {
    nextTick(() => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          userAddress.value = data.roadAddress || data.jibunAddress;
          zipCode.value = data.zonecode;
          isAddressVisible.value = false;
        },
        width: "100%",
        height: "100%",
      }).embed(document.getElementById("address-layer"));
    });
  }
};

// 가입하기
const handleSignup = async () => {
  if (!userId.value || !userPw.value || !userName.value || !userAddress.value) {
    alert("필수 항목(*)을 모두 입력해주세요.");
    return;
  }
  if (userPw.value !== userPwCheck.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/user/signup", {
      grade: userGrade.value,
      userId: userId.value,
      userPw: userPw.value,
      userName: userName.value,
      userTel: userTel.value,
      userEmail: userEmail.value,
      zipCode: zipCode.value,
      userAddress: userAddress.value,
      detailAddress: detailAddress.value,
      centerName: centerName.value,
    });

    if (response.data.success) {
      alert("회원가입 신청이 완료되었습니다.");
    }
  } catch (error) {
    console.error("가입 에러:", error);
    const errorMsg = error.response?.data?.message || "서버 연결 실패";
    alert("가입 실패: " + errorMsg);
  }
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-wrap">
      <div class="form-row">
        <label class="row-label">회원 구분</label>
        <div class="row-content radio-group">
          <material-radio
            v-model="userGrade"
            value="a1"
            id="grade-a1"
            name="userGrade"
            >일반사용자</material-radio
          >
          <material-radio
            v-model="userGrade"
            value="a2"
            id="grade-a2"
            name="userGrade"
            >기관담당자</material-radio
          >
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">아이디</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userId"
              variant="outline"
              id="userId"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <button
            type="button"
            class="green-btn shadow-btn"
            @click="checkIdDuplication"
          >
            중복 확인
          </button>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">비밀번호</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userPw"
              type="password"
              variant="outline"
              id="userPw"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <div class="btn-placeholder"></div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">비밀번호 확인</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userPwCheck"
              type="password"
              variant="outline"
              id="userPwCheck"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <div class="btn-placeholder"></div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">이름</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userName"
              variant="outline"
              id="userName"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <div class="btn-placeholder"></div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">연락처</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userTel"
              variant="outline"
              id="userTel"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <div class="btn-placeholder"></div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">이메일</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userEmail"
              variant="outline"
              id="userEmail"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <div class="btn-placeholder"></div>
        </div>
      </div>

      <div class="form-row align-start">
        <label class="row-label pt-2">주소</label>
        <div class="row-content column-layout">
          <div class="d-flex align-center w-100">
            <div class="input-flex">
              <material-input
                v-model="userAddress"
                id="userAddress"
                placeholder="검색버튼을 눌러주세요"
                variant="outline"
                readonly
                class="flex-grow-1"
              />
              <span class="required">(필수)</span>
            </div>
            <button
              type="button"
              class="green-btn shadow-btn"
              @click="openPostcode"
            >
              검색
            </button>
          </div>

          <div
            v-show="isAddressVisible"
            id="address-layer"
            class="address-box"
          ></div>

          <div class="address-sub-inputs">
            <material-input
              v-model="zipCode"
              id="zipCode"
              placeholder="우편번호"
              variant="outline"
              readonly
              style="width: 150px"
            />
            <material-input
              v-model="detailAddress"
              id="detailAddress"
              placeholder="상세 주소를 입력하세요"
              variant="outline"
              class="w-100"
            />
          </div>
        </div>
      </div>

      <div class="form-row mt-3">
        <label class="row-label">기관명</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="centerName"
              id="centerName"
              placeholder="기관 검색 버튼을 눌러주세요"
              variant="outline"
              readonly
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <button type="button" class="green-btn shadow-btn">기관 검색</button>
        </div>
      </div>

      <div class="btn-area">
        <button
          type="button"
          class="green-btn signup-btn shadow-btn"
          @click="handleSignup"
        >
          가입하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 20px;
  background-color: #fff;
}
.signup-wrap {
  width: 100%;
  max-width: 900px;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.align-start {
  align-items: flex-start;
}
.row-label {
  width: 160px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  flex-shrink: 0;
}
.row-content {
  flex: 1;
  display: flex;
  align-items: center;
}
.input-flex {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}
.radio-group {
  gap: 40px;
}
.required {
  color: #f44335;
  font-size: 14px;
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}
.green-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-placeholder {
  width: 103px;
}
.shadow-btn {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.shadow-btn:hover {
  background-color: #43a047;
  transform: translateY(-1px);
}
.btn-area {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
}
.signup-btn {
  padding: 15px 70px;
  font-size: 18px;
  border-radius: 10px;
}
.column-layout {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.address-sub-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}
:deep(.form-control) {
  border: 1px solid #d2d6da !important;
  border-radius: 8px !important;
  height: 48px !important;
  padding: 10px 15px !important;
}
.address-box {
  width: 100%;
  border: 1px solid #d2d6da;
  border-radius: 8px;
  height: 400px;
  margin: 10px 0;
}
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.w-100 {
  width: 100%;
}
.flex-grow-1 {
  flex: 1;
}
.mt-3 {
  margin-top: 15px;
}
</style>
