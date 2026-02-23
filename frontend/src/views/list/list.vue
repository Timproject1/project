<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
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
  <div class="layout">
    <div class="container">
      <div class="left">
        <RouterView name="left" />
        <div class="button">
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
          <RouterView />
        </div>
      </div>

      <div class="right">
        <RouterView name="right" />
      </div>
    </div>
  </div>
</template>
