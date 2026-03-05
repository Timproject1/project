<template>
  <div class="page-header align-items-start min-vh-100 reset-bg">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div
      class="container d-flex justify-content-center align-items-center min-vh-100"
    >
      <div class="login-card-box">
        <div class="header-bar bg-gradient-success shadow-success">
          <h4 class="text-white font-weight-bolder mb-0">비밀번호 재설정</h4>
        </div>

        <div class="login-content">
          <form @submit.prevent="handleSendAuthEmail">
            <div class="row-input mb-4">
              <label class="row-label">아이디</label>
              <input
                type="text"
                v-model="userId"
                class="custom-input"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div class="row-input mb-4">
              <label class="row-label">이메일</label>
              <input
                type="email"
                v-model="userEmail"
                class="custom-input"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div class="text-center mt-4">
              <button
                type="submit"
                class="btn-success-gradient w-100"
                :disabled="isSending"
              >
                {{ isSending ? "전송 중..." : "인증메일 전송" }}
              </button>
            </div>

            <div class="mt-4 text-start">
              <router-link to="/find-id" class="find-id-link">
                <i class="fas fa-search me-1"></i> 아이디 찾으러 가기
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"; // Vue의 반응형 데이터(ref) 기능을 가져옵니다.
import { useRouter } from "vue-router"; // 페이지 이동을 처리하기 위한 라우터 기능을 가져옵니다.
import axios from "axios"; // 서버와 통신하기 위한 라이브러리를 가져옵니다.

const router = useRouter(); // 라우터 인스턴스를 생성하여 이동 함수를 준비합니다.
const userId = ref(""); // 사용자가 입력한 아이디를 저장하는 변수입니다.
const userEmail = ref(""); // 사용자가 입력한 이메일을 저장하는 변수입니다.
const isSending = ref(false); // 메일 전송 중인지 상태를 관리하여 버튼 중복 클릭을 방지합니다.

// 인증 메일 전송 버튼을 눌렀을 때 실행되는 함수입니다.
const handleSendAuthEmail = async () => {
  if (!userId.value || !userEmail.value) {
    // 아이디와 이메일 중 하나라도 입력되지 않았는지 확인합니다.
    alert("아이디와 이메일을 모두 입력해주세요."); // 알림창을 띄워 입력을 유도합니다.
    return; // 값이 없으면 여기서 함수를 멈춥니다.
  }

  isSending.value = true; // 전송 시작을 알리고 버튼을 비활성화합니다.

  try {
    // axios를 사용하여 백엔드 서버에 아이디와 이메일 정보를 보내 확인을 요청합니다.
    const response = await axios.post(
      "http://localhost:3000/user/forgot-password",
      {
        userId: userId.value, // 입력한 아이디 데이터를 담습니다.
        userEmail: userEmail.value, // 입력한 이메일 데이터를 담습니다.
      },
    );

    if (response.data.success) {
      // 서버가 정보 확인 후 메일 전송에 성공했다는 응답을 준 경우입니다.
      alert("정보 확인 완료! 인증 메일이 발송되었습니다.\n(유효시간: 5분)"); // 안내 메시지를 보여줍니다.
      router.push("/sign-in"); // 메일을 확인하러 갈 수 있도록 로그인 화면으로 이동시킵니다.
    } else {
      // 서버는 응답했으나 정보가 일치하지 않거나 오류가 난 경우입니다.
      alert(response.data.message || "입력하신 정보가 일치하지 않습니다."); // 서버의 에러 메시지를 보여줍니다.
    }
  } catch (error) {
    // 통신 실패나 서버 다운 등의 에러가 발생한 경우입니다.
    console.error("메일 발송 에러:", error); // 개발자 콘솔에 상세 에러를 출력합니다.
    const errorMessage =
      error.response?.status === 404
        ? "서버 경로를 찾을 수 없습니다. (주소: /user/forgot-password 확인 필요)" // 주소가 틀렸을 때입니다.
        : error.response?.data?.message ||
          "오류가 발생했습니다. 다시 시도해주세요."; // 그 외의 에러 메시지를 설정합니다.
    alert(errorMessage); // 사용자에게 최종 에러 메시지를 알립니다.
  } finally {
    isSending.value = false; // 성공하든 실패하든 전송이 끝났으므로 버튼을 다시 활성화합니다.
  }
};
</script>

<style scoped>
/* 페이지 전체 배경 디자인 설정입니다. */
.reset-bg {
  background-image: url("https://images.unsplash.com/photo-1497294815431-9365093b7331?auto=format&fit=crop&w=1950&q=80");
  background-size: cover;
  position: relative;
}

/* 카드 박스의 크기와 입체감(그림자) 설정입니다. */
.login-card-box {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 5;
}

/* 상단 초록색 제목 바의 위치와 디자인입니다. */
.header-bar {
  margin: -25px 20px 0 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: linear-gradient(87deg, #00a000 0, #00a000);
}

/* 입력 폼 주변의 안쪽 여백 설정입니다. */
.login-content {
  padding: 40px 40px 30px 40px;
}

/* 라벨과 입력창을 한 줄에 정렬합니다. */
.row-input {
  display: flex;
  align-items: center;
}

/* 라벨의 너비와 폰트 스타일입니다. */
.row-label {
  width: 100px;
  font-weight: bold;
  color: #344767;
  margin-bottom: 0;
}

/* 입력창의 테두리와 둥글기 설정입니다. */
.custom-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d2d6da;
  border-radius: 5px;
  outline: none;
}

/* 입력창을 클릭(포커스)했을 때의 강조 색상입니다. */
.custom-input:focus {
  border-color: #00a000;
}

/* 전송 버튼의 그라데이션 색상과 글자 스타일입니다. */
.btn-success-gradient {
  background: linear-gradient(87deg, #00a000 0, #00a000);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

/* 전송 중일 때 버튼을 반투명하게 만듭니다. */
.btn-success-gradient:disabled {
  opacity: 0.6;
}

/* 아이디 찾기 링크의 글자 크기와 색상 설정입니다. */
.find-id-link {
  font-size: 0.9rem;
  color: #67748e;
  text-decoration: none;
  font-weight: 500;
}

/* 링크에 마우스를 올렸을 때의 변화 효과입니다. */
.find-id-link:hover {
  color: #00a000;
}
</style>
