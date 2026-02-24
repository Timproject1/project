<script setup>
import { mapMutations } from "vuex";
import { ref, computed, watch } from "vue";
const id = ref("");
const password = ref("");
const pwcheck = ref("");
const email = ref("");
const grade = ref("a1");
const center = ref("");
const idDuplicate = ref(false);
var pwIsEqual = false;
const pwcheck_fun = computed(() => {
  if (pwcheck.value == password.value) {
    pwIsEqual = true;
    return "비밀번호가 일치 합니다";
  } else {
    pwIsEqual = false;
    return "비밀번호가 다릅니다";
  }
});
const checkIdDuplicate = async function () {
  const result = await fetch().then((res) => {
    // `http://localhost:3000/user/check/${id.value}`,
    return res.json();
  });
  console.log(result);
  if (result.result.count == 0) {
    alert("사용가능합니다");
    idDuplicate.value = true;
  } else {
    alert("이미사용중입니다");
    idDuplicate.value = false;
  }
};
const signUp = async function () {
  if (!idDuplicate.value) {
    alert("아이디 중복체크 해주세요");
    return;
  }
  if (!pwIsEqual) {
    alert("비밀번호를 확인 해 주세요");
    return;
  }
  console.log(id.value);
  console.log(password.value);
  console.log(email.value);
  console.log(grade.value);
};
const showModal = ref(false); // 모달 상태 관리

// 검색 버튼 클릭 시 실행
const openAddressSearch = () => {
  showModal.value = true;
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

// 기관 선택 시 실행 (예시)
const selectCenter = (name) => {
  center.value = name;
  closeModal();
};

watch(id, () => {
  idDuplicate.value = false;
});
</script>
<template>
  <div class="bg-white">
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content card shadow-lg">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">기관 검색</h5>
          <button
            @click="closeModal"
            class="btn-close text-dark"
            style="border: none; background: none"
          >
            <i class="fas fa-times"></i> x
          </button>
        </div>
        <div class="card-body">
          <material-input label="기관명 입력" class="mb-3" />
          <div class="list-group">
            <button
              @click="selectCenter('A 복지관')"
              class="list-group-item list-group-item-action text-sm"
            >
              A 복지관 (서울시 강남구...)
            </button>
            <button
              @click="selectCenter('B 요양원')"
              class="list-group-item list-group-item-action text-sm"
            >
              B 요양원 (경기도 수원시...)
            </button>
          </div>
        </div>
        <div class="card-footer text-end">
          <material-button color="secondary" size="sm" @click="closeModal"
            >닫기</material-button
          >
        </div>
      </div>
    </div>
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
            <div class="row justify-content-center">
              <div class="card card-plain">
                <div class="pb-0 card-header bg-transparent mb-4 text-center">
                  <h4 class="font-weight-bolder">회원가입</h4>
                  <p class="mb-0">정보를 입력하여 가입을 완료해주세요.</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="handleRegister">
                    <div class="mb-3">
                      <material-input
                        id="id"
                        type="text"
                        label="아이디"
                        name="id"
                        size="lg"
                        v-model:value="id"
                      />
                      {{ id }}
                      {{ idDuplicate }}
                      <material-button
                        variant="outline"
                        color="dark"
                        size="sm"
                        class="mt-2"
                        @click="checkIdDuplicate"
                        >중복체크</material-button
                      >
                      <p v-if="idError" class="text-xs text-danger mt-1">
                        *이미 사용 중인 아이디입니다.
                      </p>
                    </div>

                    <div class="mb-3">
                      <material-input
                        id="password"
                        type="password"
                        label="비밀번호"
                        name="password"
                        size="lg"
                        v-model:value="password"
                      />
                    </div>

                    <div class="mb-3">
                      <material-input
                        id="pwcheck"
                        type="password"
                        label="비밀번호 확인"
                        name="passwordCheck"
                        size="lg"
                        v-model:value="pwcheck"
                      />
                      <p class="text-xs text-danger mt-1">
                        {{ pwcheck_fun }}
                      </p>
                    </div>

                    <div class="mb-3">
                      <material-input
                        id="email"
                        type="email"
                        label="이름"
                        name="email"
                        size="lg"
                        v-model:value="name"
                      />
                    </div>
                    <div class="mb-3">
                      <material-input
                        id="email"
                        type="text"
                        label="연락처"
                        name="tel"
                        size="lg"
                        v-model:value="tel"
                      />
                    </div>
                    <div class="mb-3">
                      <material-input
                        id="email"
                        type="email"
                        label="이메일"
                        name="email"
                        size="lg"
                        v-model:value="email"
                      />
                    </div>

                    <div class="mb-3">
                      <material-input
                        id="address"
                        type="text"
                        label="주소"
                        name="address"
                        size="lg"
                        v-model:value="address"
                        readonly
                      />
                    </div>
                    <div class="mb-3">
                      <material-input
                        id="address"
                        type="text"
                        label="기관"
                        name="address"
                        size="lg"
                        v-model:value="center"
                        readonly
                      />
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        @click="openAddressSearch"
                        >검색</material-button
                      >
                    </div>
                    <div class="mb-3">
                      <material-radio
                        id="g1"
                        name="test"
                        value="a1"
                        v-model="grade"
                      >
                        일반이용자
                      </material-radio>

                      <material-radio
                        id="g2"
                        name="test"
                        value="a2"
                        v-model="grade"
                      >
                        기관관리자
                      </material-radio>
                      {{ grade }}
                    </div>
                    <div class="text-center">
                      <material-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        type="button"
                        @click="signUp"
                        >가입하기</material-button
                      >
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    이미 계정이 있으신가요?
                    <router-link
                      :to="{ name: 'SignIn' }"
                      class="text-success text-gradient font-weight-bold"
                      >로그인</router-link
                    >
                  </p>
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
// import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialButton from "@/components/MaterialButton.vue";
// const body = document.getElementsByTagName("body")[0];
import MaterialRadio from "@/components/MaterialRadio.vue";
export default {
  name: "SignUp",
  components: {
    navbar: Navbar, // 템플릿 태그 <navbar>와 매칭
    MaterialInput,
    MaterialButton,
    MaterialRadio,
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
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
}

.list-group-item {
  cursor: pointer;
  transition: background 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

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
