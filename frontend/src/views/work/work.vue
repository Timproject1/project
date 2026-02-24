<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import axios from "axios";

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

let doc = ref([]);
const getdoc = async () => {
  let result = await axios(`/api/work`).catch((err) => console.error(err));
  doc.value = result.data;
};
// import { useRouter } from "vue-router";
// const router = useRouter();
// const gotodoc = async (docno) => {
// router.push({ path: "info", query: { no: docno } });
// };

onBeforeMount(() => {
  getdoc();
});
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
          <h3>지원신청서</h3>
          <table border="1px solid #000">
            <thead>
              <tr>
                <th>number</th>
                <th>질문</th>
                <th>답</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="docs in doc" :key="docs.responce_num">
                <td>{{ docs.responce_num }}</td>
                <td>{{ docs.question_num }}</td>
                <td v-if="docs.answer_text == null">
                  {{ docs.select_answer }}
                </td>
                <td v-else>{{ docs.answer_text }}</td>
              </tr>
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
<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* body 스크롤 차단 */
}

.left,
.right {
  flex: 1;
  overflow-y: auto; /* 각각 독립 스크롤 */
}
</style>
