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
  },
  {
    count: 2,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일3.png"],
    showPlanDelete: false,
    app: "승인 대기 중",
  },
  {
    count: 3,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일4.png"],
    showPlanDelete: false,
    app: "승인 재요청",
  },
  {
    count: 3,
    date: "2026-02-24",
    planName: "목표",
    planContent: "내용",
    file: ["파일4.png"],
    showPlanDelete: false,
    app: "반려",
  },
]);

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const day = ref(`${yyyy}-${mm}-${dd}`);

const newPlan = ref(false);
const modifyPlan = ref(false);

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

const returnPlan = ref(false);
const returnPlanContent = ref("어림도없지");
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
      <material-button type="button">승인 요청</material-button>
    </template>
    <template #actions="{ close }">
      <material-button type="button" @click="close">취소</material-button>
    </template>
  </Modal>
  <!-- 지원기획서 출력 -->
  <div v-for="Plan in Plans" :key="Plan.count">
    <p>{{ Plan.date }} 지원계획 {{ Plan.count }}</p>
    <material-button type="button" size="sm" @click="modifyPlan = true"
      >수정</material-button
    >
    <material-button type="button" size="sm" @click="Plan.showPlanDelete = true"
      >삭제</material-button
    >
    <!-- 수정 모달 -->
    <modal v-if="modifyPlan" @close="modifyPlan = false">
      <template #content>
        <material-input
          id="text"
          placeholder="제목입력"
          :value="`${Plan.planName}`"
        />
        <material-input
          id="text"
          placeholder="내용입력"
          :value="`${Plan.planContent}`"
        />
        <material-input id="text" placeholder="수정사유" />
        <material-button type="button">첨부파일 등록</material-button>
        <div v-for="file in Plan.file" :key="file">
          <p>{{ file }}</p>
        </div>
        <material-button type="button">수정 완료</material-button>
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">취소</material-button>
      </template>
    </modal>
    <!-- 삭제 모달 -->
    <Modal v-if="Plan.showPlanDelete" @close="Plan.showPlanDelete = false">
      <template #content>
        <p>해당 지원계획서를 <br />삭제하시겠습니까?</p>
        <material-button type="button" color="danger">예</material-button>
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">아니오</material-button>
      </template>
    </Modal>
    <div>
      <!-- 목표 및 내용 출력 -->
      <h4>{{ Plan.planName }}</h4>
      <br />
      <p>{{ Plan.planContent }}</p>
      <br />
    </div>
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
    <p v-else-if="Plan.app == '승인 대기 중'">
      <material-button type="button" color="warning"
        >승인 대기 중</material-button
      ><material-button type="button" color="danger"
        >승인 요청 취소</material-button
      >
    </p>
    <p v-else-if="Plan.app == '반려'">
      <material-button type="button" color="warning" @click="returnPlan = true"
        >반려</material-button
      >
      <Modal v-if="returnPlan" @close="returnPlan = false">
        <template #content>
          <h4>반려 사유</h4>
          <p>{{ returnPlanContent }}</p>
        </template>
        <template #actions="{ close }">
          <material-button type="button" @click="close">닫기</material-button>
        </template>
      </Modal>
    </p>
    <p v-else>
      <material-button type="button" color="warning"
        >승인 재요청</material-button
      >
    </p>
  </div>
</template>
