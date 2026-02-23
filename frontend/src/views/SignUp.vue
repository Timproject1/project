<template>
  <div class="bg-white">
    <div class="container top-0 position-sticky z-index-sticky">
      <div class="row">
        <div class="col-12">
          <navbar
            isBlur="blur my-3 py-2 mt-4 start-0 end-0 mx-4 shadow blur border-radius-lg"
            btnBackground="bg-gradient-success"
            :darkMode="true"
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
                <div class="card card-plain mt-5">
                  <div class="pb-0 card-header bg-transparent mb-2 text-start">
                    <h4 class="font-weight-bolder">회원가입</h4>
                  </div>
                  <div class="card-body">
                    <form role="form" @submit.prevent="handleRegister">
                      <div class="custom-row mb-3">
                        <label class="custom-label">아이디</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.user_id"
                            id="user_id"
                            type="text"
                            variant="outline"
                          />
                          <small v-if="errors.idExists" class="error-msg"
                            >* 사용할 수 없는 아이디입니다.</small
                          >
                        </div>
                        <material-button
                          type="button"
                          color="success"
                          variant="gradient"
                          size="sm"
                          class="ms-2 mb-0"
                          @click="checkId"
                          >중복 확인</material-button
                        >
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="custom-row mb-3">
                        <label class="custom-label">비밀번호</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.user_pw"
                            id="password"
                            type="password"
                            variant="outline"
                          />
                        </div>
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="custom-row mb-3">
                        <label class="custom-label">비밀번호 확인</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.confirm_pw"
                            id="confirm_pw"
                            type="password"
                            variant="outline"
                          />
                          <small v-if="isPwMismatch" class="error-msg"
                            >* 비밀번호가 틀렸습니다</small
                          >
                        </div>
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="custom-row mb-3">
                        <label class="custom-label">이름</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.user_name"
                            id="name"
                            type="text"
                            variant="outline"
                          />
                        </div>
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="custom-row mb-3">
                        <label class="custom-label">연락처</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.phone"
                            id="phone"
                            type="text"
                            variant="outline"
                          />
                        </div>
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="custom-row mb-3">
                        <label class="custom-label">이메일</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.email"
                            id="email"
                            type="email"
                            variant="outline"
                          />
                          <small v-if="errors.emailExists" class="error-msg"
                            >* 가입 된 이메일입니다.</small
                          >
                        </div>
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="custom-row mb-3">
                        <label class="custom-label">기관명</label>
                        <div class="custom-content">
                          <material-input
                            v-model="form.org_name"
                            id="org"
                            type="text"
                            variant="outline"
                            readonly
                          />
                        </div>
                        <material-button
                          type="button"
                          color="success"
                          variant="gradient"
                          size="sm"
                          class="ms-2 mb-0"
                          @click="openOrgSearch"
                          >검색</material-button
                        >
                        <span class="required-text">(필수)</span>
                      </div>

                      <div class="text-center">
                        <material-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          type="submit"
                          >가입하기</material-button
                        >
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// 2. 컴포넌트 경로를 프로젝트 구조에 맞춰 정확히 지정
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { mapMutations } from "vuex";

export default {
  name: "SignUp",
  components: {
    navbar: Navbar, // 템플릿 태그 <navbar>와 매칭
    MaterialInput,
    MaterialButton,
  },
  data() {
    return {
      form: {
        user_id: "",
        user_pw: "",
        confirm_pw: "",
        user_name: "",
        phone: "",
        email: "",
        org_name: "",
      },
      errors: { idExists: false, emailExists: false },
    };
  },
  computed: {
    isPwMismatch() {
      return (
        this.form.user_pw !== this.form.confirm_pw &&
        this.form.confirm_pw !== ""
      );
    },
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    checkId() {
      alert("아이디 중복 확인");
    },
    openOrgSearch() {
      window.open("/org-search", "orgSearch", "width=500,height=600");
    },
    handleRegister() {
      alert("가입 완료!");
    },
  },
  mounted() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
};
</script>

<style scoped>
/* 시안의 레이아웃을 위한 스타일 */
.custom-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
}
.custom-label {
  width: 120px;
  min-width: 120px;
  padding-top: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #344767;
  text-align: left;
}
.custom-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.error-msg {
  color: #f44335;
  font-size: 0.7rem;
  margin-top: 2px;
  text-align: left;
}
.required-text {
  color: #f44335;
  font-size: 0.7rem;
  padding-top: 12px;
  margin-left: 10px;
  white-space: nowrap;
}
</style>
