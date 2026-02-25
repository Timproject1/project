<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, reactive } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";

const Plans = reactive([
  {
    count: 1,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일1.png", "파일2.jpg"],
    showPlanDelete: false,
    app: "승인 완료",
    modifyPlan: false,
  },
  {
    count: 2,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일3.png"],
    showPlanDelete: false,
    app: "승인 대기 중",
    modifyPlan: false,
  },
  {
    count: 3,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일4.png"],
    showPlanDelete: false,
    app: "승인 재요청",
    modifyPlan: false,
  },
  {
    count: 3,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일4.png"],
    showPlanDelete: false,
    app: "반려",
    modifyPlan: false,
  },
]);

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const day = ref(`${yyyy}-${mm}-${dd}`);

const newPlan = ref(false);

const revision = reactive([
  {
    date: "2026-02-24",
    id: "김길동",
    comment: "내용수정",
    revisionPlan: false,
  },
  {
    date: "2026-02-24",
    id: "이길동",
    comment: "제목수정",
    revisionPlan: false,
  },
  {
    date: "2026-02-24",
    id: "홍길동",
    comment: "첨부파일수정",
    revisionPlan: false,
  },
]);

const returnplan = ref(false);
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
      <p>{{ day }}</p>
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
  <div v-for="Plan in Plans" :key="Plan.count">
    <p>{{ Plan.date }} 지원계획 {{ Plan.count }}</p>
    <!-- 목표 및 내용 출력 -->
    <h4>{{ Plan.planName }}</h4>
    <br />
    <p>{{ Plan.planContent }}</p>
    <br />
    <!-- 첨부파일 -->
    <div v-for="file in Plan.file" :key="file">
      <p>첨부파일</p>
      <p>{{ file }}</p>
    </div>
    <!-- 수정내역 -->
    <material-button
      type="button"
      size="sm"
      @click="revision.revisionPlan = true"
      >수정내역 확인</material-button
    >
    <Modal v-if="revision.revisionPlan" @close="revision.revisionPlan = false">
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
            <tr v-for="revisions in revision" :key="revisions.id">
              <td>{{ revisions.date }}</td>
              <td>{{ revisions.id }}</td>
              <td>{{ revisions.comment }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Modal>
    <p v-if="Plan.app == '승인 완료'">
      <material-button type="button" color="warning" disabled
        >승인 완료</material-button
      >
    </p>
    <p v-else>
      <material-button type="button" color="warning">승인</material-button
      ><material-button type="button" color="danger" @click="returnplan = true"
        >반려</material-button
      >
      <Modal v-if="returnplan" @close="returnplan = false">
        <template #content>
          <h4>반려사유</h4>
          <material-input id="text" placeholder="반려사유작성" />
          <material-button type="button">반려</material-button>
        </template>
        <template #actions="{ close }">
          <material-button type="button" @click="close">취소</material-button>
        </template>
      </Modal>
    </p>
  </div>
</template>
