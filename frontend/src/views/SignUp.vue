<script setup>
import { mapMutations } from "vuex";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
const id = ref(""); //아이디
const password = ref(""); //비밀번호
const pwcheck = ref(""); //비밀번호확인
const email = ref(""); //이메일
const grade = ref("a1"); //등급 a1:일반 ,a2:기관담당자
const center_name = ref(""); //센터명
const registernum = ref(""); //센터 사업자번호
const idDuplicate = ref(false); //중복체크 여부
const filter = ref(""); //검색 필더
const tel = ref(""); //전화번호
const centerList = ref([]); //센터목록
const address = ref(""); //주소
const name = ref(""); //이름
const router = useRouter(); //이동용 라우터
var pwIsEqual = false; //비번일치유무
const pwcheck_fun = computed(() => {
  if (pwcheck.value == password.value) {
    pwIsEqual = true;
    return "비밀번호가 일치 합니다";
  } else {
    pwIsEqual = false;
    return "비밀번호가 다릅니다";
  }
});
//아이디 중복체크
const checkIdDuplicate = async function () {
  const result = await fetch(
    `http://localhost:3000/user/check/${id.value}`,
  ).then((res) => {
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
//회원가입
const signUp = async function () {
  if (!idDuplicate.value) {
    alert("아이디 중복체크 해주세요");
    return;
  }
  if (!pwIsEqual || !pwcheck.value || !password.value) {
    alert("비밀번호를 확인 해 주세요");
    return;
  }
  //멤버
  const member = {
    id: id.value,
    password: password.value,
    email: email.value,
    tel: tel.value,
    grade: grade.value,
    address: address.value,
    center: registernum.value,
    name: name.value,
  };

  const result = await fetch(`http://localhost:3000/user/signup`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(member),
  }).then((res) => res.json());

  if (result.retCode == "OK") {
    alert("회원가입 성공");
    router.push("/sign-in");
  } else {
    alert("회원가입 실패");
  }
};
const showModal = ref(false); // 모달 상태 관리
//센터 목록을 받아오는 함수
const searchCenter = async (filter = "") => {
  const result = await fetch(
    `http://localhost:3000/center/list/?filter=${filter}`,
  ).then((res) => {
    return res.json();
  });
  return result;
};
// 검색 버튼 클릭 시 실행
const openCenterSearch = async () => {
  const list = await searchCenter();
  centerList.value = list.result;
  console.log(list);
  showModal.value = true;
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

//모달창에서 검색버튼 클릭시
const clickSearch = async () => {
  const list = await searchCenter(filter.value);
  centerList.value = list.result;
  showModal.value = true;
};
// 기관 선택 시 실행 (예시)
const selectCenter = (num, name) => {
  registernum.value = num;
  center_name.value = name;
  document.querySelector("#center").focus();
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
          <material-input
            label="기관명 입력"
            class="mb-3"
            v-model:value="filter"
          />
          <material-button
            class="mt-4"
            variant="gradient"
            color="success"
            fullWidth
            size="lg"
            type="button"
            @click="clickSearch()"
            >검색</material-button
          >
          <div class="list-group scroll-area">
            <div
              v-for="center in centerList"
              :key="center.registernum"
              class="mb-2"
              @click="selectCenter(center.registernum, center.center_name)"
            >
              <material-button
                variant="gradient"
                color="success"
                fullWidth
                size="lg"
              >
                기관명: {{ center.center_name }} <br />
                기관주소: {{ center.center_addr }} <br />
                연락처: {{ center.center_tel }}
              </material-button>
            </div>
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
                      <!-- 아이디 양방향 연결 -->
                      <material-input
                        id="id"
                        type="text"
                        label="아이디"
                        name="id"
                        size="lg"
                        :required="true"
                      />
                      <!-- 클릭시 아이디 중복체크 -->
                      <material-button
                        variant="outline"
                        color="dark"
                        size="sm"
                        class="mt-2"
                        >중복체크</material-button
                      >
                      <p v-if="idError" class="text-xs text-danger mt-1">
                        *이미 사용 중인 아이디입니다.
                      </p>
                    </div>
                    <div class="mb-3">
                      <!-- 비밀번호 양방향연결 -->
                      <material-input
                        id="password"
                        type="password"
                        label="비밀번호"
                        name="password"
                        size="lg"
                        :required="true"
                      />
                    </div>
                    <div class="mb-3">
                      <!-- 비밀번호확인 양방향연결 -->
                      <material-input
                        id="pwcheck"
                        type="password"
                        label="비밀번호 확인"
                        :required="true"
                        name="passwordCheck"
                        size="lg"
                      />
                      <p class="text-xs text-danger mt-1">
                        {{ pwcheck_fun }}
                      </p>
                    </div>
                    <div class="mb-3">
                      <!-- 이름 양방향 연결 -->
                      <material-input
                        id="name"
                        type="text"
                        label="이름"
                        name="name"
                        :required="true"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <!-- 전화번호 양방향 연결 -->
                      <material-input
                        id="tel"
                        type="text"
                        label="연락처"
                        name="tel"
                        :required="true"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <!-- 이메일 양방향 연결 -->
                      <material-input
                        id="email"
                        type="email"
                        label="이메일"
                        name="email"
                        :required="true"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <!-- 주소 양방향 연결 -->
                      <material-input
                        id="address"
                        type="text"
                        label="주소"
                        :required="true"
                        name="address"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <material-input
                        id="center"
                        type="text"
                        label="기관"
                        name="address"
                        :required="true"
                        size="lg"
                        :readonly="true"
                        v-model="registernum"
                      />
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        @click="openCenterSearch"
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
                    </div>
                    <div class="text-center">
                      <!-- 클릭시 가입 함수 실행 -->
                      <material-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        type="button"
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
    // checkId() {
    //   alert("아이디 중복 확인");
    // },
    // openOrgSearch() {
    //   window.open("/org-search", "orgSearch", "width=500,height=600");
    // },
    // handleRegister() {
    //   alert("가입 완료!");
    // },
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
.scroll-area {
  max-height: 250px;
  overflow-y: auto;
}
</style>
