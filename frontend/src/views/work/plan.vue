<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onBeforeMount } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextarea from "@/components/MaterialTextarea.vue";
import axios from "axios";
import { useMemberStore } from "@/store/member";
import { useDocStore } from "../../store/doc";

const memberStore = useMemberStore();
const docStore = useDocStore();

const Plans = ref([]);
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
    returnPlan: false,
    revision: [],
  }));
  // console.log(result.data.result);
};
onBeforeMount(() => {
  listPlan();
  filelist();
});

//지원계획 추가
const addPlanName = ref(""); //목표
const addPlanContent = ref(""); //내용
const addPlan = async () => {
  console.log(addPlanName.value, addPlanContent.value);
  if (!addPlanName.value) {
    alert("제목을 입력해주세요");
    return;
  } else if (!addPlanContent.value) {
    alert("내용을 입력해주세요");
    return;
  }

  let add = {
    doc_num: docStore.doc_num,
    plan_manager: memberStore.id,
    plan_approved: "d1",
    plan_title: addPlanName.value,
    plan_content: addPlanContent.value,
  };

  const result = ref(null);
  try {
    const res = await axios.post("http://localhost:3000/document/plan", add);
    console.log(res.data);
    result.value = res.data;
    addPlanName.value = "";
    addPlanContent.value = "";
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
  newPlan.value = false;
};
//임시저장
const draft = async () => {
  let savedate = {
    plan_num: "plan-9999999",
    doc_num: docStore.doc_num,
    plan_title: addPlanName.value,
    plan_content: addPlanContent.value,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/saveplan",
      savedate,
    );
    console.log(res.data);
    result.value = res.data;
    addPlanName.value = "";
    addPlanContent.value = "";
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//임시저장 불러오기
const sevedate = async () => {
  let result = await axios
    .post(`http://localhost:3000/document/bringplan`)
    .catch((err) => console.log(err));

  const data = result.data;
  newPlan.value = true;
  addPlanName.value = data.result[0].plan_title;
  addPlanContent.value = data.result[0].plan_content;
  console.log(data.result[0]);
};

//승인 재요청
const restart = async (id) => {
  console.log(id);
  let res = {
    plan_num: id,
  };
  let result = await axios
    .post(`http://localhost:3000/document/restartplan/`, res)
    .catch((err) => console.log(err));

  const data = result.data;
  console.log(data);
  location.reload();
};
//승인 취소
const cancel = async (id) => {
  console.log(id);
  let res = {
    plan_num: id,
  };
  let result = await axios
    .post(`http://localhost:3000/document/cancelplan/`, res)
    .catch((err) => console.log(err));

  const data = result.data;
  console.log(data);
  location.reload();
};

//수정완료
const original = ref([]);
const openresmodal = (res) => {
  original.value = { ...res };
  res.modifyPlan = true;
};
const plancomment = ref("");
const Update = async (id) => {
  const columns = [];
  console.log(id);
  for (let key of Object.keys(id)) {
    // 수정 가능한 필드만 체크
    if (["plan_title", "plan_content"].includes(key)) {
      // console.log(id);
      if (id[key] !== original.value[key]) {
        columns.push(key);
      }
    }
  }

  let updatedate = {
    plan_title: id.plan_title,
    plan_content: id.plan_content,
    plan_num: id.plan_num,
    plan_modified_by: memberStore.id,
    plan_modified_comment: plancomment.value,
    plan_modified_title: columns.join(","),
    plan_modified_content: id.plan_content,
  };
  console.log(plancomment.value);
  console.log(id);
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/updateplan",
      updatedate,
    );
    console.log(res.data);
    result.value = res.data;
    id.modifyPlan = false;
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
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

//삭제
const delplan = async (id) => {
  let del = {
    plan_num: id.plan_num,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/deleteplan",
      del,
    );
    console.log(res.data);
    result.value = res.data;
    Plans.value.showPlanDelete = false;
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//시간 2026-02-27식으로 출력하기
const timedate = (id) => {
  const today = new Date(id);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
//지원기획서 추가 모달
const newPlan = ref(false);
//파일리스트
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
    <div
      class="work-section-header d-flex justify-content-between align-items-center mb-3"
    >
      <h4 class="mb-0 fw-bold text-dark">지원계획서</h4>
      <div class="work-section-header-actions">
        <material-button type="button" size="sm" @click="sevedate()"
          >임시저장 내용</material-button
        >
        <material-button
          type="button"
          size="sm"
          color="info"
          @click="newPlan = true"
          >지원계획서 추가</material-button
        >
      </div>
    </div>

    <!-- 지원계획서 추가 모달 -->
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
            @click="draft()"
            >임시저장</material-button
          >
        </div>
        <material-input
          id="text"
          placeholder="목표입력"
          v-model="addPlanName"
        />
        <material-textarea
          id="text"
          placeholder="내용입력"
          v-model="addPlanContent"
        />
        <div class="add-modal-file-row">
          <material-button type="button">첨부파일 등록</material-button>
          <p class="mb-0">파일이름</p>
        </div>
      </template>
      <template #actions="{ close }">
        <material-button
          type="button"
          color="success"
          class="btn-register"
          @click="addPlan()"
          >승인 요청</material-button
        >
        <material-button
          type="button"
          class="btn-cancel"
          @click="
            () => {
              addPlanName = '';
              addPlanContent = '';
              close();
            }
          "
          >취소</material-button
        >
      </template>
    </Modal>

    <!-- 지원계획서 출력 -->
    <div
      v-for="Plan in Plans"
      :key="Plan.plan_num"
      class="record-item border rounded-3 p-3 mb-3 bg-white"
    >
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="mb-0 text-sm text-secondary">
          {{ timedate(Plan.plan_date) }} · 지원계획 {{ Plan.row_num }}
        </p>
        <div class="d-flex gap-2">
          <material-button
            type="button"
            size="sm"
            color="info"
            @click="openresmodal(Plan)"
            >수정</material-button
          >
          <material-button
            type="button"
            size="sm"
            color="danger"
            @click="Plan.showPlanDelete = true"
            >삭제</material-button
          >
        </div>
      </div>

      <!-- 수정 모달 -->
      <modal v-if="Plan.modifyPlan" @close="Plan.modifyPlan = false">
        <template #content>
          <material-input
            id="text"
            placeholder="제목입력"
            v-model="Plan.plan_title"
          />
          <material-input
            id="text"
            placeholder="내용입력"
            v-model="Plan.plan_content"
          />
          <material-input
            id="text"
            placeholder="수정사유"
            v-model="plancomment"
          />
          <material-button type="button" color="success" @click="Update(Plan)"
            >수정 완료</material-button
          >
        </template>
        <template #actions="{ close }">
          <material-button type="button" @click="close">취소</material-button>
        </template>
      </modal>

      <!-- 삭제 모달 -->
      <Modal v-if="Plan.showPlanDelete" @close="Plan.showPlanDelete = false">
        <template #content>
          <p class="mb-3">해당 지원계획서를 <br />삭제하시겠습니까?</p>
          <material-button type="button" color="danger" @click="delplan(Plan)"
            >예</material-button
          >
        </template>
        <template #actions="{ close }">
          <material-button type="button" @click="close">아니오</material-button>
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

      <!-- 수정내역 -->
      <div class="mt-2">
        <material-button type="button" size="sm" @click="revisions(Plan)"
          >수정내역 확인</material-button
        >
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
      </div>

      <div class="mt-2">
        <p v-if="Plan.plan_approved == 'd2'">
          <material-button type="button" color="warning" disabled
            >승인 완료</material-button
          >
        </p>
        <p v-else-if="Plan.plan_approved == 'd1'">
          <material-button type="button" color="warning"
            >승인 대기 중</material-button
          >
          <material-button
            type="button"
            color="danger"
            @click="cancel(Plan.plan_num)"
            >승인 요청 취소</material-button
          >
        </p>
        <p v-else-if="Plan.plan_approved == 'd3'">
          <material-button
            type="button"
            color="warning"
            @click="Plan.returnPlan = true"
            >반려</material-button
          >
          <Modal v-if="Plan.returnPlan" @close="Plan.returnPlan = false">
            <template #content>
              <h4>반려 사유</h4>
              <p>{{ Plan.plan_return_reason }}</p>
            </template>
            <template #actions="{ close }">
              <material-button type="button" @click="close"
                >닫기</material-button
              >
            </template>
          </Modal>
        </p>
        <p v-else>
          <material-button
            type="button"
            color="warning"
            @click="restart(Plan.plan_num)"
            >승인 재요청</material-button
          >
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.work-section-card {
  background: #ffffff;
  padding: 18px 18px 20px;
}

.work-section-header-actions {
  display: flex;
  gap: 8px;
}

.record-item {
  border-color: #e9ecef;
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
