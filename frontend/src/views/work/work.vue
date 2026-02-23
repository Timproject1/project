<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { useRouter } from "vue-router";
// import { ref } from "vue";
// import axios from "axios";

const router = useRouter();

const goplan = () => {
  router.push("/work/plan");
};

const gopriority = () => {
  router.push("/work/priority");
};

const gorecord = () => {
  router.push("/work/record");
};

const goresult = () => {
  router.push("/work/result");
};

const gorepresentative = () => {
  router.push("/work/representative");
};

// let doc = ref({});
</script>
<template>
  <div class="layout">
    <div class="container">
      <div class="left">
        <RouterView name="left" />
        <div class="button">
          <material-button @click="gorepresentative" size="lg"
            >담당자 변경</material-button
          >

          <material-button @click="gopriority" size="lg"
            >우선순위 선택</material-button
          >
          <br />
          <material-button @click="gorecord" size="lg"
            >상담기록</material-button
          >

          <material-button @click="goplan" size="lg"
            >지원기획서</material-button
          >

          <material-button @click="goresult" size="lg"
            >지원결과서</material-button
          >
        </div>
        <br />
        <br />
        <div id="doc">
          <table>
            <caption>
              지원신청서
            </caption>
            <thead>
              <tr>
                <th>number</th>
                <th>질문</th>
                <th>답</th>
              </tr>
            </thead>
            <tbody>
              <!-- <tr v-for doc in dooc>
                <td></td> -->
              <!-- </tr> -->
            </tbody>
          </table>
        </div>
      </div>
      <div class="right">
        <RouterView name="right" />
      </div>
    </div>
  </div>
</template>
