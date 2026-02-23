<template>
  <div class="bg-white">
    <div class="container top-0 position-sticky z-index-sticky">
      <div class="row">
        <div class="col-12">
          <navbar
            isBlur="blur my-3 py-2 mt-4 start-0 end-0 mx-4 shadow blur border-radius-lg"
          />
        </div>
      </div>
    </div>
    <main class="mt-0 main-content">
      <section>
        <div class="page-header min-vh-100">
          <div class="container">
            <div class="row">
              <div
                class="col-6 d-lg-flex d-none h-100 my-auto pe-0 ps-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
              >
                <div
                  class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
                  style="
                    background-image: url(&quot;https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80&quot;);
                    background-size: cover;
                  "
                ></div>
              </div>

              <div
                class="col-xl-5 col-lg-6 col-md-8 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5"
              >
                <div class="card card-plain mt-8">
                  <div class="card-body">
                    <form
                      role="form"
                      class="text-start"
                      @submit.prevent="handleLogin"
                    >
                      <p
                        v-if="loginError"
                        class="text-danger text-xs font-weight-bolder mb-3"
                      >
                        * 입력된 정보를 확인해주십시오.
                      </p>

                      <div class="custom-login-row mb-4">
                        <label class="login-label">아이디</label>
                        <material-input
                          v-model="user_id"
                          id="user_id"
                          type="text"
                          variant="outline"
                          class="flex-grow-1"
                        />
                      </div>

                      <div class="custom-login-row mb-4">
                        <label class="login-label">비밀번호</label>
                        <material-input
                          v-model="user_pw"
                          id="password"
                          type="password"
                          variant="outline"
                          class="flex-grow-1"
                        />
                      </div>

                      <div class="text-center">
                        <material-button
                          class="my-2"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          >로 그 인</material-button
                        >
                      </div>

                      <div class="text-center">
                        <router-link :to="{ name: 'SignUp' }">
                          <material-button
                            class="my-2"
                            variant="gradient"
                            color="success"
                            fullWidth
                            size="lg"
                            >회원가입</material-button
                          >
                        </router-link>
                      </div>
                    </form>
                  </div>
                  <div class="card-footer text-center pt-0 px-lg-2 px-1">
                    <p class="mb-4 text-sm mx-auto text-end">
                      <a
                        href="javascript:;"
                        class="text-warning text-gradient font-weight-bold"
                        >아이디/비밀번호 찾기</a
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <form role="form" class="text-start mt-3">
              <div class="mb-3">
                <material-input
                  id="email"
                  type="email"
                  label="Email"
                  name="email"
                />
              </div>
              <div class="mb-3">
                <material-input
                  id="password"
                  type="password"
                  label="Password"
                  name="password"
                />
              </div>
              <material-switch id="rememberMe" name="rememberMe"
                >Remember me</material-switch
              >
              <div class="text-center">
                <material-button
                  class="my-4 mb-2"
                  variant="gradient"
                  color="success"
                  fullWidth
                  >Sign in</material-button
                >
              </div>
              <p class="mt-4 text-sm text-center">
                Don't have an account?
                <router-link
                  :to="{ name: 'SignUp' }"
                  class="text-success text-gradient font-weight-bold"
                  >Sign up</router-link
                >
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { mapMutations } from "vuex";

export default {
  name: "SignIn",
  components: {
    Navbar,
    MaterialInput,
    MaterialButton,
  },
  data() {
    return {
      user_id: "",
      user_pw: "",
      loginError: false, // 시안의 빨간 에러 메시지 제어
    };
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    handleLogin() {
      if (!this.user_id || !this.user_pw) {
        this.loginError = true;
      } else {
        alert("로그인 시도: " + this.user_id);
      }
    },
  },
  mounted() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
};
</script>

<style scoped>
/* 시안 image_9e52fa.png 레이아웃 재현 */
.custom-login-row {
  display: flex;
  align-items: center;
}
.login-label {
  width: 100px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #344767;
  margin-bottom: 0;
}
.text-warning {
  color: #fb8c00 !important; /* 찾기 링크 색상 */
}
</style>
