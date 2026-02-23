<script setup>
import { mapMutations } from "vuex";
import { ref, computed, watch, onMounted } from "vue";
const id = ref("");
const password = ref("");
const pwcheck = ref("");
const email = ref("");
const grade = ref("a1");
const options = [
  "{item:`a1`,value=`일반 회원`}",
  "{item:`a2`,value=`기관담당자`}",
];
const selected = ref([]);
var idDuplicate = false;
watch(id, () => {
  idDuplicate = false;
});
onMounted(console.log(selected.value));
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
  const result = await fetch(
    `http://localhost:3000/user/check/${id.value}`,
  ).then((res) => {
    return res.json();
  });
  console.log(result);
  if (result.result.count == 0) {
    alert("사용가능합니다");
    idDuplicate = true;
  } else {
    alert("이미사용중입니다");
    idDuplicate = false;
  }
};
</script>
<template>
  <div class="bg-white">
    <div class="container top-0 position-sticky z-index-sticky">
      <div class="row">
        <div class="col-12">
          <navbar
            isBlur="blur my-3 py-2 mt-4 start-0 end-0 mx-4 shadow blur border-radius-lg"
            btnBackground="bg-gradient-success"
            v-bind:darkMode="true"
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
                      <p
                        v-if="passwordErrorMessage"
                        class="text-xs text-danger mt-1"
                      >
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
                        v-model:value="address"
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
                        type="submit"
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
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
// import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialButton from "@/components/MaterialButton.vue";
const body = document.getElementsByTagName("body")[0];
import MaterialRadio from "@/components/MaterialRadio.vue";
export default {
  name: "sign-up",
  components: {
    Navbar,
    MaterialInput,
    MaterialButton,
    MaterialRadio,
  },
  beforeMount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
  },
};
</script>
