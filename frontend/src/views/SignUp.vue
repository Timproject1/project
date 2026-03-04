<!-- <script setup>
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
</style> -->

<script setup>
import { ref, reactive, computed } from "vue"; // Vue에서 데이터를 다루고 계산하기 위한 기능들을 가져옵니다.
import axios from "axios"; // 서버와 통신할 때 사용하는 라이브러리를 가져옵니다.
import MaterialInput from "@/components/MaterialInput.vue"; // 디자인된 입력창 컴포넌트를 가져옵니다.

// 데이터 상태 관리 (서버로 보낼 보따리라고 생각하면 됩니다)
const form = reactive({
  user_id: "", // 사용자가 입력한 아이디를 담습니다.
  user_password: "", // 사용자가 입력한 비밀번호를 담습니다.
  user_name: "", // 사용자가 입력한 이름을 담습니다.
  user_tel: "", // 사용자가 입력한 전화번호를 담습니다.
  user_email: "", // 사용자가 입력한 이메일을 담습니다.
  registernum: "", // 기관 검색으로 가져온 기관 번호를 담습니다.
  grade: "a1", // 회원 등급이며 기본값은 일반사용자(a1)입니다.
  actived: "Y", // 계정 사용 가능 여부이며 기본값은 Y입니다.
});

const userPwCheck = ref(""); // 비밀번호가 맞는지 재확인하기 위해 입력한 값을 따로 담습니다.
const institutionName = ref(""); // 화면에 보여주기 위한 기관 이름을 담습니다.
const emailDuplicate = ref(false); // 이메일 중복 상태를 표시하기 위한 스위치입니다.

// 비밀번호 일치 확인 (실시간으로 두 비밀번호가 다른지 체크합니다)
const isPasswordMismatch = computed(() => {
  return (
    form.user_password !== "" && // 비밀번호가 비어있지 않고
    userPwCheck.value !== "" && // 확인란도 비어있지 않은데
    form.user_password !== userPwCheck.value // 두 값이 서로 다르면 '참(true)'을 반환합니다.
  );
});

// 아이디 중복 확인 함수
const checkIdDuplication = async () => {
  if (!form.user_id) {
    // 아이디를 입력하지 않고 버튼을 눌렀다면
    alert("아이디를 입력해주세요."); // 알림창을 띄우고
    return; // 여기서 멈춥니다.
  }
  try {
    // 서버에 이 아이디가 이미 있는지 물어봅니다.
    const response = await axios.post("http://localhost:3000/user/check-id", {
      user_id: form.user_id,
    });
    if (response.data.isDuplicate) {
      // 서버가 중복이라고 대답하면
      alert("이미 사용 중인 아이디입니다.");
    } else {
      // 중복이 아니라고 대답하면
      alert("사용 가능한 아이디입니다.");
    }
  } catch (error) {
    // 서버가 꺼져있거나 통신 에러가 나면 실행됩니다.
    console.error("중복 확인 에러:", error);
    alert("서버 연결 실패! 백엔드가 실행 중인지 확인하세요.");
  }
};

// 기관 검색 함수
const searchInstitution = () => {
  institutionName.value = "발달장애인복지관"; // 가짜 기관 이름을 넣습니다.
  form.registernum = "1018112345"; // 해당 기관의 번호를 폼에 저장합니다.
  alert("기관이 선택되었습니다."); // 완료 알림을 띄웁니다.
};

// 회원가입 제출 함수
const handleSignup = async () => {
  // 필수 값이 하나라도 빠졌는지 확인합니다.
  if (
    !form.user_id ||
    !form.user_password ||
    !form.user_name ||
    !form.registernum
  ) {
    alert("필수 항목(*)을 모두 입력하고 기관 검색을 완료해주세요.");
    return; // 빠진 게 있다면 멈춥니다.
  }
  // 비밀번호가 서로 다른지 확인합니다.
  if (isPasswordMismatch.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return; // 다르면 멈춥니다.
  }

  try {
    // 모든 준비가 끝났으니 서버로 가입 데이터를 보냅니다.
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      form,
    );
    if (response.data.success) {
      // 가입이 성공하면
      alert("회원가입이 완료되었습니다!");
    }
  } catch (error) {
    // 가입 중 에러가 나면
    console.error("가입 에러:", error);
    alert("가입 실패: " + (error.response?.data?.message || "서버 오류"));
  }
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-wrap">
      <h2 class="signup-title">회원가입</h2>
      <div class="form-row">
        <label class="row-label">가입 유형</label>
        <div class="row-content">
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="form.grade" value="a2" /> 기관담당자
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.grade" value="a1" /> 일반사용자
            </label>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label" for="user_id">아이디</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_id"
              id="user_id"
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
        <label class="row-label" for="user_password">비밀번호</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_password"
              id="user_password"
              type="password"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label" for="user_password_check">비밀번호 확인</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userPwCheck"
              id="user_password_check"
              type="password"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <p v-if="isPasswordMismatch" class="error-msg-abs">
            * 비밀번호가 일치하지 않습니다.
          </p>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label" for="user_name">이름</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_name"
              id="user_name"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label" for="user_tel">연락처</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_tel"
              id="user_tel"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label" for="user_email">이메일</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              type="email"
              v-model="form.user_email"
              id="user_email"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <p v-if="emailDuplicate" class="error-msg-abs">
            * 이미 가입된 이메일입니다.
          </p>
        </div>
      </div>

      <div class="form-row">
        <label class="row-label" for="institution_name">기관명</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="institutionName"
              id="institution_name"
              placeholder="기관 검색 버튼을 눌러주세요"
              variant="outline"
              readonly
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <button
            type="button"
            class="green-btn shadow-btn"
            @click="searchInstitution"
          >
            기관 검색
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
  </div>
</template>

<style scoped>
/* 화면의 디자인(CSS)을 담당하는 부분입니다. 수정되지 않았습니다. */
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
.radio-group {
  display: flex;
  gap: 30px;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: bold;
}
input[type="radio"] {
  accent-color: #00a000;
  width: 18px;
  height: 18px;
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
  transition: 0.2s;
}
.green-btn:hover {
  background-color: #008800;
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
.shadow-btn {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
