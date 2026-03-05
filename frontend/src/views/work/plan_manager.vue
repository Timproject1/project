<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onBeforeMount } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";
// import { useMemberStore } from "@/store/member";
import { useDocStore } from "../../store/doc";

// const memberStore = useMemberStore();
const docStore = useDocStore();

//지원기획서 승인 리스트
const Plans = ref([]);
console.log(Plans);
const listPlan = async () => {
  let doc = docStore.doc_num;
  let result = await axios
    .get(`http://localhost:3000/document/planlist/${doc}`)
    .catch((err) => console.log(err));
  Plans.value = (result.data.result || []).map((r) => ({
    ...r,
    file: r.file || [],
    showPlanDelete: false,
    modifyPlan: false,
    showRevision: false,
    returnplan: false,
    revision: [],
  }));
  console.log(result.data.result);
};
onBeforeMount(() => {
  listPlan();
});

//승인
const appPlan = async (id) => {
  let appPlan = {
    doc_num: docStore.doc_num,
    plan_num: id.plan_num,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/appplan",
      appPlan,
    );
    result.value = res.data;
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//반려
const returnReason = ref("");
const returnplan = async (id) => {
  let appPlan = {
    plan_return_reason: returnReason.value,
    plan_num: id,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/returnplan",
      appPlan,
    );
    result.value = res.data;
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};

//시간 2026-02-27식으로 출력하기
const timedate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const newPlan = ref(false);

//수정 내역 출력
const revisions = async (id) => {
  // console.log(id);
  try {
    let result = await axios
      .get(`http://localhost:3000/document/modifyPlanlist/${id.plan_num}`)
      .catch((err) => console.log(err));
    id.revision = Array.isArray(result.data.result) ? result.data.result : [];
    id.showRevision = true;
  } catch {
    id.revision = [];
    id.showRevision = true;
  }
};
</script>
<template>
  <h4>지원계획서</h4>
  <material-button type="button">임시저장 내용</material-button>
  <material-button type="button" @click="newPlan = true"
    >지원계획서 추가</material-button
  >
  <!-- 지원계획서 추가 모달 -->
  <Modal v-if="newPlan" @close="newPlan = false">
    <template #content>
      <p>{{ timedate(new Date()) }}</p>
      <material-button type="button" size="sm">임시저장</material-button>
      <material-input id="text" placeholder="목표입력" />
      <material-input id="text" placeholder="내용입력" />
      <material-button type="button">첨부파일 등록</material-button>
      <p>파일이름</p>
      <material-button type="button">등록</material-button>
    </template>
    <template #actions="{ close }">
      <material-button type="button" @click="close">취소</material-button>
    </template>
  </Modal>
  <!-- 지원기획서 출력 -->
  <div v-for="Plan in Plans" :key="Plan.doc_num">
    <p>{{ timedate(Plan.plan_date) }} 지원계획 {{ Plan.row_num }}</p>
    <!-- 목표 및 내용 출력 -->
    <h4>{{ Plan.plan_title }}</h4>
    <br />
    <p>{{ Plan.plan_content }}</p>
    <br />
    <!-- 첨부파일 -->
    <p>첨부파일</p>
    <div
      v-for="file in filename.filter((f) => f.plan_num === Plan.plan_num)"
      :key="file.file_num"
    >
      <p>{{ file.origin_name }}</p>
    </div>
    <material-button type="button" size="sm" @click="revisions(Plan)"
      >수정내역 확인</material-button
    >
    <Modal v-if="Plan.showRevision" @close="Plan.showRevision = false">
      <template #actions="{ close }">
        <material-button type="button" @click="close">X</material-button>
      </template>
      <template #content>
        <table>
          <thead>
            <tr>
              <th>수정날짜</th>
              <th>이름</th>
              <th>수정내용</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="revisions in Plan.revision"
              :key="revisions.plan_modifi_num"
            >
              <td>{{ timedate(revisions.plan_modified_date) }}</td>
              <td>{{ revisions.plan_modified_by }}</td>
              <td>{{ revisions.plan_modified_comment }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Modal>
    <p v-if="Plan.plan_approved == 'd1'">
      <material-button type="button" color="warning" @click="appPlan(Plan)"
        >승인</material-button
      ><material-button
        type="button"
        color="danger"
        @click="Plan.returnplan = true"
        >반려</material-button
      >
      <Modal v-if="Plan.returnplan" @close="Plan.returnplan = false">
        <template #content>
          <h4>반려사유</h4>
          <material-input
            id="text"
            placeholder="반려사유작성"
            v-model="returnReason"
          />
          <material-button type="button" @click="returnplan(Plan.plan_num)"
            >반려</material-button
          >
        </template>
        <template #actions="{ close }">
          <material-button type="button" @click="close">취소</material-button>
        </template>
      </Modal>
    </p>
    <p v-else-if="Plan.plan_approved == 'd2'">
      <material-button type="button" color="warning" disabled
        >승인 완료</material-button
      >
    </p>
    <p v-else>
      <material-button type="button" color="warning" disabled
        >반려</material-button
      >
    </p>
  </div>
</template>
