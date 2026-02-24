<template>
  <navbar btnBackground="bg-gradient-success" />
  <div
    class="page-header align-items-start min-vh-100"
    style="
      background-image: url(&quot;https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80&quot;);
    "
  >
    <span class="mask bg-gradient-dark opacity-6"></span>

    <div
      class="container d-flex justify-content-center align-items-center min-vh-100"
    >
      <div class="login-card-box">
        <div class="header-bar bg-gradient-success shadow-success">
          <h4 class="text-white font-weight-bolder mb-0">
            발달장애인 지원 프로그램
          </h4>
        </div>

        <div class="login-content">
          <div class="error-msg-area">
            <p v-if="loginError" class="text-danger text-sm">
              * 입력된 정보를 확인해주십시오.
            </p>
          </div>

          <form role="form" @submit.prevent="handleLogin">
            <div class="row-input mb-4">
              <label class="row-label">아이디</label>
              <material-input
                id="id"
                v-model:value="userId"
                class="row-field"
              />
            </div>

            <div class="row-input mb-5">
              <label class="row-label">비밀번호</label>
              <material-input
                id="password"
                type="password"
                v-model:value="password"
                class="row-field"
              />
            </div>

            <material-button
              class="action-btn mb-3"
              variant="gradient"
              color="success"
              fullWidth
              size="lg"
              type="submit"
              >로 그 인</material-button
            >

            <router-link :to="{ name: 'SignUp' }">
              <material-button
                class="action-btn mb-3"
                variant="gradient"
                color="success"
                fullWidth
                size="lg"
                >회 원 가 입</material-button
              >
            </router-link>

            <div class="text-end mt-2">
              <a href="javascript:;" class="find-link-text"
                >아이디/비밀번호 찾기</a
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

const store = useStore();
const userId = ref("");
const password = ref("");
const loginError = ref(false);

// 가상의 DB 데이터 (실제 DB 연동 전 테스트용)
const mockDB = [
  { id: "admin", pw: "1234", name: "관리자" },
  { id: "user01", pw: "password", name: "홍길동" },
  { id: "admin", pw: "1234", name: "이민호" },
];

const handleLogin = () => {
  // 1. 입력값이 비어있는지 확인
  if (!userId.value || !password.value) {
    loginError.value = true;
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  // 사용자 찾기
  const user = mockDB.find(
    (u) => u.id === userId.value && u.pw === password.value,
  );

  if (user) {
    // 로그인 정보가 있으면 환영합니다. ***님 메시지 전송
    loginError.value = false;
    alert(`환영합니다. ${user.name}님!`);
    console.log("로그인 성공");
  } else {
    // 로그인 정보가 없으면 정보를 다시 입력해주세요. 메시지 전송
    loginError.value = true;
    alert("등록된 회원 정보가 없습니다. 정보를 다시 입력해주세요.");
  }
};

onBeforeMount(() => {
  store.commit("toggleEveryDisplay");
  store.commit("toggleHideConfig");
});
onBeforeUnmount(() => {
  store.commit("toggleEveryDisplay");
  store.commit("toggleHideConfig");
});
</script>

<style scoped>
/* 화면 중앙 고정 박스  */
.login-card-box {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: visible;
  z-index: 5;
}

.header-bar {
  margin: -25px 20px 0 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
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
  font-size: 1.1rem;
  margin-bottom: 0;
  color: #344767;
}

.row-field {
  flex: 1;
}

/* 버튼 스타일 */
.action-btn {
  font-size: 1.1rem !important;
  font-weight: bold !important;
  letter-spacing: 5px;
  border-radius: 10px !important;
  margin: 0;
}

.error-msg-area {
  height: 25px;
  text-align: center;
  margin-bottom: 10px;
}

.find-link-text {
  font-size: 0.9rem;
  color: #7b809a;
  text-decoration: none;
}
.find-link-text:hover {
  color: #4caf50;
}
</style>
