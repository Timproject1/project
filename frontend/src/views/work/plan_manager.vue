<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onBeforeMount } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextarea from "@/components/MaterialTextarea.vue";
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
  filelist();
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
const filename = ref([]);
console.log(filename);
const filelist = async () => {
  let result = await axios
    .get(`http://localhost:3000/document/planFile`)
    .catch((err) => console.log(err));
  console.log(result.data.result);
  filename.value = Array.isArray(result.data.result) ? result.data.result : [];
};
</script>
<template>
  <div class="work-section-card card shadow-lg border-0 border-radius-xl">
    <div class="work-section-header d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold text-dark">지원계획서 승인</h4>
      <div class="work-section-header-actions">
        <material-button type="button" size="sm" disabled
          >임시저장 내용</material-button
        >
        <material-button type="button" size="sm" @click="newPlan = true"
          >지원계획서 추가</material-button
        >
      </div>
    </div>

    <!-- 지원계획서 추가 모달 (관리자용 작성 기능) -->
    <Modal v-if="newPlan" class="plan-add-modal" @close="newPlan = false">
      <template #content>
        <div class="add-modal-draft-row">
          <p class="mb-0 text-secondary add-modal-draft-date">
            {{ timedate(new Date()) }}
          </p>
          <material-button
            type="button"
            size="sm"
            class="btn-draft"
            disabled
            >임시저장</material-button
          >
        </div>
        <material-input id="text" placeholder="목표입력" />
        <material-textarea id="text-content" placeholder="내용입력" />
        <div class="add-modal-file-row">
          <material-button type="button">첨부파일 등록</material-button>
          <p class="mb-0">파일이름</p>
        </div>
      </template>
      <template #actions="{ close }">
        <material-button type="button" color="success" class="btn-register"
          >등록</material-button
        >
        <material-button type="button" class="btn-cancel" @click="close"
          >취소</material-button
        >
      </template>
    </Modal>

    <!-- 지원기획서 출력 -->
    <div
      v-for="Plan in Plans"
      :key="Plan.doc_num"
      class="record-item border rounded-3 p-3 mb-3 bg-white"
    >
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="mb-0 text-sm text-secondary">
          {{ timedate(Plan.plan_date) }} · 지원계획 {{ Plan.row_num }}
        </p>
        <div class="d-flex gap-2">
          <material-button type="button" size="sm" @click="revisions(Plan)"
            >수정내역</material-button
          >
        </div>
      </div>

      <!-- 수정내역 모달 -->
      <Modal v-if="Plan.showRevision" @close="Plan.showRevision = false">
        <template #actions="{ close }">
          <material-button type="button" @click="close">X</material-button>
        </template>
        <template #content>
          <table class="table table-bordered table-sm mb-0">
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

      <div class="mt-2">
        <!-- 목표 및 내용 출력 -->
        <h5 class="fw-semibold mb-1">{{ Plan.plan_title }}</h5>
        <p class="mb-2">{{ Plan.plan_content }}</p>
      </div>

      <!-- 첨부파일 -->
      <div class="mt-2">
        <p class="text-sm text-secondary mb-1">첨부파일</p>
        <div
          v-for="file in filename.filter((f) => f.plan_num === Plan.plan_num)"
          :key="file.file_num"
          class="text-sm"
        >
          <p class="mb-0">{{ file.origin_name }}</p>
        </div>
      </div>

      <!-- 승인 / 반려 -->
      <div class="mt-3 text-end">
        <div v-if="Plan.plan_approved == 'd1'">
          <material-button type="button" color="warning" class="me-1" @click="appPlan(Plan)"
            >승인</material-button
          >
          <material-button
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
        </div>
        <div v-else-if="Plan.plan_approved == 'd2'">
          <material-button type="button" color="warning" disabled
            >승인 완료</material-button
          >
        </div>
        <div v-else>
          <material-button type="button" color="warning" disabled
            >반려</material-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.work-section-card {
  background: var(--app-surface);
  padding: 18px 18px 20px;
}

.work-section-header-actions {
  display: flex;
  gap: 8px;
}

.record-item {
  border-color: var(--app-border-muted);
}

.add-modal-file-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-modal-draft-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.add-modal-draft-row :deep(.btn-draft) {
  width: 20%;
  min-width: 80px;
}

.add-modal-draft-row .add-modal-draft-date {
  font-size: 0.875rem;
}

/* 지원계획서 추가 모달: 버튼 같은 크기, 취소 회색 */
.plan-add-modal :deep(.mt-3) .btn-register,
.plan-add-modal :deep(.mt-3) .btn-cancel {
  min-width: 100px;
}

.plan-add-modal :deep(.btn-cancel) {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.plan-add-modal :deep(.btn-cancel:hover) {
  background-color: #5a6268;
  border-color: #545b62;
  color: #fff;
}
</style>
