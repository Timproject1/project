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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userId = ref("");
const userEmail = ref("");
const isSending = ref(false);

const handleSendAuthEmail = async () => {
  if (!userId.value || !userEmail.value) {
    alert("아이디와 이메일을 모두 입력해주세요.");
    return;
  }

  isSending.value = true;

  try {
    setTimeout(() => {
      const mockDB = { id: "admin", email: "admin@example.com" };

      if (userId.value === mockDB.id && userEmail.value === mockDB.email) {
        alert("정보 확인 완료! 인증 메일이 발송되었습니다.\n(유효시간: 5분)");
        router.push("/login");
      } else {
        alert("입력하신 아이디 또는 이메일이 등록된 정보와 일치하지 않습니다.");
      }
      isSending.value = false;
    }, 1500);
  } catch (error) {
    console.error(error);
    alert("오류가 발생했습니다. 다시 시도해주세요.");
    isSending.value = false;
  }
};
</script>

<style scoped>
/* 배경 이미지 */
.reset-bg {
  background-image: url("https://images.unsplash.com/photo-1497294815431-9365093b7331?auto=format&fit=crop&w=1950&q=80");
  background-size: cover;
  position: relative;
}

.login-card-box {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 5;
}

.header-bar {
  margin: -25px 20px 0 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: linear-gradient(87deg, #00a000 0, #00a000);
}

.login-content {
  padding: 40px 40px 30px 40px;
}

.row-input {
  display: flex;
  align-items: center;
}

.row-label {
  width: 100px;
  font-weight: bold;
  color: #344767;
  margin-bottom: 0;
}

.custom-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d2d6da;
  border-radius: 5px;
  outline: none;
}

.custom-input:focus {
  border-color: #00a000;
}

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

.btn-success-gradient:disabled {
  opacity: 0.6;
}

.find-id-link {
  font-size: 0.9rem;
  color: #67748e;
  text-decoration: none;
  font-weight: 500;
}

.find-id-link:hover {
  color: #00a000;
}
</style>
