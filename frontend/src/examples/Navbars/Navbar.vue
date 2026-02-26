<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goplan = () => {
  router.push("/work/plan");
};

const gopriority = () => {
  router.push("/list/supported");
};

const gorecord = () => {
  router.push("/work/record");
};
const gorepresentative = () => {
  router.push("/work/representative");
};
</script>
<template>
  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
    :class="isAbsolute ? 'mt-4' : 'mt-0'"
  >
    <div
      class="container-fluid py-1 px-3 d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center">
        <h5 class="mb-0 font-weight-bolder me-4">발달장애인 지원 프로그램</h5>
      </div>

      <div
        class="collapse navbar-collapse d-flex justify-content-start"
        id="navbar"
      >
        <div class="navbar-nav d-flex flex-row">
          <material-button @click="gorepresentative" size="lg"
            >Home</material-button
          >

          <material-button @click="gopriority" size="lg"
            >지원자 관리</material-button
          >
          <br />
          <material-button @click="gorecord" size="lg"
            >마이페이지</material-button
          >

          <material-button @click="goplan" size="lg">로그아웃</material-button>
        </div>
      </div>

      <div class="ms-md-auto d-flex align-items-center">
        <span class="me-4 text-sm font-weight-bold">시스템 관리자 김길동</span>

        <ul class="navbar-nav justify-content-end flex-row">
          <li class="nav-item d-flex align-items-center me-2">
            <button class="btn btn-sm btn-outline-primary mb-0">
              마이 페이지
            </button>
          </li>
          <li class="nav-item d-flex align-items-center">
            <button class="btn btn-sm btn-outline-primary mb-0">
              로그아웃
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
// 기존 스크립트 로직 유지 (필요에 따라 MaterialInput 등은 제거 가능)
import { mapMutations, mapState } from "vuex";
import MaterialButton from "@/components/MaterialButton.vue";
export default {
  name: "navbar",
  data() {
    return {
      showMenu: false,
    };
  },
  props: ["minNav", "color"],
  methods: {
    ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
    toggleSidebar() {
      this.navbarMinimize();
    },
  },
  computed: {
    ...mapState(["isRTL", "isAbsolute"]),
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>

<style scoped>
/* 버튼 스타일이 너무 크다면 조정 */
.btn-sm {
  padding: 0.5rem 1rem;
  white-space: nowrap;
}
/* 이미지처럼 파란색 계열을 강조하고 싶을 때 */
.btn-primary {
  background-color: #5e92cd !important;
  border-color: #5e92cd !important;
}
</style>
