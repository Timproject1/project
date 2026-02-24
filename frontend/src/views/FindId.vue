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
          <h4 class="text-white font-weight-bolder mb-0">
            {{ isResultMode ? "아이디 찾기 결과" : "아이디 찾기" }}
          </h4>
        </div>

        <div class="login-content">
          <div v-if="!isResultMode">
            <form role="form" @submit.prevent="handleFindId">
              <div class="row-input mb-4">
                <label class="row-label">이름</label>
                <material-input
                  id="name"
                  v-model:value="findName"
                  class="row-field"
                />
              </div>

              <div class="row-input mb-5">
                <label class="row-label">이메일</label>
                <material-input
                  id="email"
                  type="email"
                  v-model:value="findEmail"
                  class="row-field"
                />
              </div>

              <div class="d-flex gap-2">
                <material-button
                  class="action-btn flex-fill"
                  variant="gradient"
                  color="success"
                  size="lg"
                  type="submit"
                  >아이디 찾기</material-button
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

          <div v-else class="text-center py-4">
            <div class="result-box mb-5">
              <h3 class="font-weight-normal">
                아이디는 <br />
                <strong class="text-success">{{ foundId }}</strong> 입니다.
              </h3>
            </div>

            <div class="d-flex gap-2">
              <router-link :to="{ name: 'SignIn' }" class="flex-fill">
                <material-button
                  class="action-btn w-100"
                  variant="gradient"
                  color="success"
                  size="lg"
                  >로그인</material-button
                >
              </router-link>

              <material-button
                class="action-btn flex-fill"
                variant="gradient"
                color="success"
                size="lg"
                @click="goToResetPw"
                >비밀번호 재설정</material-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// 상태 관리
const findName = ref("");
const findEmail = ref("");
const isResultMode = ref(false); // 화면 전환 스위치
const foundId = ref("");

// 관리자용 테스트 데이터
const mockDB = [{ id: "admin", name: "관리자", email: "admin@test.com" }];

const handleFindId = () => {
  if (!findName.value || !findEmail.value) {
    alert("정보를 모두 입력해주세요.");
    return;
  }

  // DB 조회 로직
  const user = mockDB.find(
    (u) => u.name === findName.value && u.email === findEmail.value,
  );

  if (user) {
    // 정보가 있으면 결과 화면으로 전환
    foundId.value = user.id;
    isResultMode.value = true;
  } else {
    // db에 정보가 없으면 정보가 없다고 뜨게
    alert("일치하는 결과가 없으면, 일치하는 아이디가 없습니다. 로 표시.");
  }
};
</script>

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
  color: #344767;
}
.row-field {
  flex: 1;
}

/* 결과 박스 스타일 */
.result-box {
  border: 1px solid #dee2e6;
  padding: 40px 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.action-btn {
  font-weight: bold !important;
  border-radius: 10px !important;
  letter-spacing: 1px;
}
</style>
