<script setup>
/* eslint-disable */
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

const store = useStore();
const router = useRouter();

const userId = ref("");
const password = ref("");
const loginError = ref(false);

const handleLogin = async () => {
  if (!userId.value || !password.value) {
    loginError.value = true;
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/user/login", {
      user_id: userId.value,
      user_password: password.value,
    });

    if (response.data && response.data.success) {
      loginError.value = false;
      alert(`환영합니다, ${response.data.user.user_name}님!`);

      localStorage.setItem("userName", response.data.user.user_name);
      localStorage.setItem("userGrade", response.data.user.grade);

      router.push({ name: "Home" });
    } else {
      loginError.value = true;
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    loginError.value = true;

    if (error.response && error.response.status === 404) {
      alert(
        "서버의 로그인 경로(404)를 찾을 수 없습니다. 백엔드 라우터를 확인하세요.",
      );
    } else {
      alert("서버 연결에 실패했습니다. 백엔드가 켜져있는지 확인하세요.");
    }
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

<template>
  <navbar btnBackground="bg-gradient-success" />
  <div
    class="page-header align-items-start min-vh-100"
    style="
      background-image: url(&quot;https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80&quot;);
    "
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div
      class="container d-flex justify-content-center align-items-center min-vh-100"
    >
      <div class="login-card-box">
        <div class="header-bar bg-gradient-success shadow-success">
          <h4 class="text-white font-weight-bolder mb-0 text-center">
            발달장애인 지원 프로그램
          </h4>
        </div>
        <div class="login-content">
          <div class="error-msg-area">
            <p v-if="loginError" class="text-danger text-sm text-center">
              * 입력된 정보를 확인해주십시오.
            </p>
          </div>
          <form role="form" @submit.prevent="handleLogin">
            <div class="row-input mb-4">
              <label class="row-label" for="id">아이디</label>
              <material-input id="id" v-model="userId" class="row-field" />
            </div>
            <div class="row-input mb-5">
              <label class="row-label" for="password">비밀번호</label>
              <material-input
                id="password"
                type="password"
                v-model="password"
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
                type="button"
                >회 원 가 입</material-button
              >
            </router-link>

            <div class="find-options mt-3 text-center">
              <router-link to="/find-id" class="find-link"
                >아이디 찾기</router-link
              >
              <span class="divider">|</span>
              <router-link to="/find-pw" class="find-link"
                >비밀번호 찾기</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  color: #344767;
}
.row-field {
  flex: 1;
}
.action-btn {
  font-size: 1.1rem !important;
  font-weight: bold !important;
  letter-spacing: 5px;
  border-radius: 10px !important;
}
.error-msg-area {
  height: 25px;
  margin-bottom: 10px;
}

.find-options {
  border-top: 1px solid #f0f2f5;
  padding-top: 15px;
}
.find-link {
  font-size: 0.9rem;
  color: #7b809a;
  text-decoration: none;
  transition: color 0.2s ease;
}
.find-link:hover {
  color: #4caf50;
}
.divider {
  margin: 0 15px;
  color: #d2d6da;
}
</style>
