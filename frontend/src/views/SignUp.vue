<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import MaterialInput from "@/components/MaterialInput.vue";

const router = useRouter();

const form = reactive({
  user_id: "", // 사용자 아이디
  user_password: "", // 비밀번호
  user_name: "", // 사용자 이름
  user_tel: "", // 연락처
  user_email: "", // 이메일
  registernum: "", // 기관 등록 번호
  grade: "a1", // 기본 권한 등급
  actived: "Y", // 활성 상태 여부
});

const userPwCheck = ref(""); // 비밀번호 확인 입력값
const institutionName = ref(""); // 선택된 기관 이름 (화면 표시용)
const emailDuplicate = ref(false); // 이메일 중복 여부 상태
const isModalOpen = ref(false); // 기관 검색 모달 열림/닫힘 상태
const searchQuery = ref(""); // 기관 검색어
const centers = ref([]); // 검색된 기관 목록 리스트

// 비밀번호와 비밀번호 확인 값이 입력되었고, 두 값이 일치하지 않는지 체크
const isPasswordMismatch = computed(() => {
  return (
    form.user_password !== "" &&
    userPwCheck.value !== "" &&
    form.user_password !== userPwCheck.value
  );
});

// 아이디 중복 확인 함수
const checkIdDuplication = async () => {
  if (!form.user_id) {
    alert("아이디를 입력해주세요.");
    return;
  }
  try {
    const res = await axios.post("http://localhost:3000/user/check-id", {
      user_id: form.user_id,
    });
    alert(
      res.data.isDuplicate
        ? "이미 사용 중인 아이디입니다."
        : "사용 가능한 아이디입니다.",
    );
  } catch (e) {
    alert("서버 연결 실패");
  }
};

// 기관 목록 조회 함수 (API 통신)
const fetchInstitutions = async () => {
  try {
    const url = `http://localhost:3000/center/list`;
    const res = await axios.get(url, { params: { name: searchQuery.value } });

    console.log("서버 응답 데이터:", res.data);
    centers.value = res.data.result; // 검색 결과를 상태값에 저장
  } catch (e) {
    console.error("에러 상세:", e);
    alert("서버 연결에 실패했습니다.");
  }
};

// 모달에서 특정 기관을 선택했을 때 처리하는 함수
const selectOrg = (org) => {
  institutionName.value = org.center_name; // 화면에 보일 기관명 설정
  form.registernum = org.registernum; // 폼 데이터에 등록번호 저장
  isModalOpen.value = false; // 모달 닫기
};

const handleSignup = async () => {
  if (!form.user_id || !form.user_password || !form.registernum) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }
  try {
    const res = await axios.post("http://localhost:3000/user/signup", form);
    if (res.data.success) {
      alert("회원가입 완료!");
      router.push("/sign-in");
    }
  } catch (e) {
    alert("가입 실패");
  }
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-wrap">
      <h2 class="signup-title">회원가입</h2>

      <div class="form-row">
        <label class="row-label">아이디</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_id"
              variant="outline"
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
              v-model="form.user_password"
              type="password"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
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
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <p v-if="isPasswordMismatch" class="error-msg-abs">
            * 비밀번호가 틀렸습니다.
          </p>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">이름</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_name"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">연락처</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_tel"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">이메일</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_email"
              type="email"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <p v-if="emailDuplicate" class="error-msg-abs">
            * 기입 된 이메일입니다.
          </p>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label">기관명</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="institutionName"
              readonly
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <button
            type="button"
            class="green-btn shadow-btn"
            @click="isModalOpen = true"
          >
            검색
          </button>
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

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-search-box">
          <label class="row-label" style="width: 80px">기관명</label>
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="fetchInstitutions"
            placeholder="기관명을 입력하세요"
          />
          <button type="button" class="green-btn" @click="fetchInstitutions">
            검색
          </button>
        </div>

        <div class="table-container">
          <table class="org-table">
            <thead>
              <tr>
                <th>기관명</th>
                <th>주소</th>
                <th>연락처</th>
                <th>사용</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="center in centers" :key="center.registernum">
                <td>{{ center.center_name }}</td>
                <td>{{ center.center_addr }}</td>
                <td>{{ center.center_tel }}</td>
                <td>
                  <button
                    type="button"
                    class="green-btn select-btn"
                    @click="selectOrg(center)"
                  >
                    사용
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="text-align: right; margin-top: 20px">
          <button
            class="green-btn"
            style="background-color: #666"
            @click="isModalOpen = false"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스타일은 동일하여 생략합니다. */
.signup-container {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
}
.signup-wrap {
  width: 100%;
  max-width: 800px;
  border: 2px solid #00a000;
  padding: 40px;
  border-radius: 12px;
}
.signup-title {
  text-align: center;
  margin-bottom: 40px;
  color: #00a000;
  font-size: 24px;
}
.form-row {
  display: flex;
  position: relative;
  margin-bottom: 30px;
  align-items: center;
}
.row-label {
  width: 150px;
  font-weight: bold;
  color: #333;
}
.row-content {
  flex: 1;
  display: flex;
  align-items: center;
}
.input-flex {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
}
.required {
  color: #ff5722;
  font-size: 0.8rem;
  white-space: nowrap;
  width: 60px;
  text-align: center;
}
.green-btn {
  background-color: #00a000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap;
}
.error-msg-abs {
  color: #f44335;
  font-size: 12px;
  position: absolute;
  bottom: -22px;
  left: 150px;
}
.btn-area {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.signup-btn {
  padding: 15px 60px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: white;
  padding: 30px;
  border: 1px solid #333;
  width: 750px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-search-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.modal-search-box input {
  flex: 1;
  height: 40px;
  border: 1px solid #ccc;
  padding: 0 10px;
}
.org-table {
  width: 100%;
  border-collapse: collapse;
}
.org-table th,
.org-table td {
  border: 1px solid #333;
  padding: 10px;
  text-align: center;
}
.org-table th {
  background: #eee;
}
</style>
