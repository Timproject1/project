<template>
  <navbar btnBackground="bg-gradient-success" />
  <div
    class="page-header align-items-start min-vh-100"
    style="
      background-image: url(&quot;https://images.unsplash.com/photo-1497294815431-9365093b7331?auto=format&fit=crop&w=1950&q=80&quot;);
    "
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div
      class="container d-flex justify-content-center align-items-center min-vh-100"
    >
      <div class="login-card-box">
        <div class="header-bar bg-gradient-success shadow-success">
          <h4 class="text-white font-weight-bolder mb-0">비밀번호 변경</h4>
        </div>

        <div class="login-content">
          <form role="form" @submit.prevent="handleUpdatePw">
            <div class="row-input mb-4">
              <label class="row-label">새 비밀번호</label>
              <material-input
                id="newPassword"
                type="password"
                v-model:value="newPassword"
                class="row-field"
                placeholder="새 비밀번호 입력"
              />
            </div>

            <div class="row-input mb-2">
              <label class="row-label">비밀번호 확인</label>
              <material-input
                id="confirmPassword"
                type="password"
                v-model:value="confirmPassword"
                class="row-field"
                placeholder="비밀번호 재입력"
              />
            </div>

            <div class="text-start mb-5 ms-5 ps-4">
              <span
                v-if="confirmPassword && isMatched"
                class="text-success text-xs"
              >
                * 비밀번호가 일치합니다.
              </span>
              <span
                v-else-if="confirmPassword && !isMatched"
                class="text-danger text-xs"
              >
                * 비밀번호가 일치하지 않습니다.
              </span>
            </div>

            <div class="d-flex gap-2">
              <material-button
                class="action-btn flex-fill"
                variant="gradient"
                color="success"
                size="lg"
                type="submit"
                :disabled="!isMatched"
                >비밀번호 변경</material-button
              >

              <router-link :to="{ name: 'SignIn' }" class="flex-fill">
                <material-button
                  class="action-btn w-100"
                  variant="gradient"
                  color="secondary"
                  size="lg"
                  >취 소</material-button
                >
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");

// 비밀번호 일치 여부 실시간 계산
const isMatched = computed(() => {
  return (
    newPassword.value !== "" && newPassword.value === confirmPassword.value
  );
});

const handleUpdatePw = () => {
  if (!isMatched.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 관리자 계정 변경 성공 시나리오
  alert("관리자(admin) 계정의 비밀번호가 성공적으로 변경되었습니다.");
  router.push({ name: "SignIn" }); // 로그인 화면으로 이동
};
</script>

<style scoped>
/* 기존 시안들과 동일한 스타일 유지 */
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
}
.login-content {
  padding: 40px 40px 30px 40px;
}
.row-input {
  display: flex;
  align-items: center;
}
.row-label {
  width: 110px;
  font-weight: bold;
  font-size: 1rem;
  color: #344767;
}
.row-field {
  flex: 1;
}
.action-btn {
  font-weight: bold !important;
  border-radius: 10px !important;
}
</style>
