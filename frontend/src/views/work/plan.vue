<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, reactive, onBeforeMount } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";

const Plans = ref([]);
const listPlan = async () => {
  let result = await axios
    .get(`http://localhost:3000/document/planlist`)
    .catch((err) => console.log(err));
  Plans.value = (result.data.result || []).map((r) => ({
    ...r,
    file: r.file || [],
    showPlanDelete: false,
    modifyPlan: false,
    showRevision: false,
    returnPlan: false,
  }));
  console.log(result.data.result);
};
onBeforeMount(() => {
  listPlan();
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
    doc_num: "doc-1",
    plan_approved: "d1",
    plan_manager: "ca1",
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
    doc_num: "doc-1",
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
</script>
<template>
  <h4>지원계획서</h4>
  <material-button type="button" @click="sevedate()"
    >임시저장 내용</material-button
  >
  <material-button type="button" @click="newPlan = true"
    >지원계획서 추가</material-button
  >
  <!-- 지원계획서 추가 모달 -->
  <Modal v-if="newPlan" @close="newPlan = false">
    <template #content>
      <p>{{ timedate(new Date()) }}</p>
      <material-button type="button" size="sm" @click="draft()"
        >임시저장</material-button
      >
      <material-input id="text" placeholder="목표입력" v-model="addPlanName" />
      <material-input
        id="text"
        placeholder="내용입력"
        v-model="addPlanContent"
      />
      <!-- <material-button type="button">첨부파일 등록</material-button>
      <p>파일이름</p> -->
      <material-button type="button" @click="addPlan()"
        >승인 요청</material-button
      >
    </template>
    <template #actions="{ close }">
      <material-button type="button" @click="close">취소</material-button>
    </template>
  </Modal>
  <!-- 지원기획서 출력 -->
  <div v-for="Plan in Plans" :key="Plan.plan_num">
    <p>{{ timedate(Plan.plan_req_date) }} 지원계획 {{ Plan.row_num }}</p>
    <material-button type="button" size="sm" @click="Plan.modifyPlan = true"
      >수정</material-button
    >
    <material-button type="button" size="sm" @click="Plan.showPlanDelete = true"
      >삭제</material-button
    >
    <!-- 수정 모달 -->
    <modal v-if="Plan.modifyPlan" @close="Plan.modifyPlan = false">
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
        <!-- <material-button type="button">첨부파일 등록</material-button>
        <div v-for="file in Plan.file" :key="file">
          <p>{{ file }}</p>
        </div> -->
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
      <h4>{{ Plan.plan_title }}</h4>
      <br />
      <p>{{ Plan.plan_content }}</p>
      <br />
    </div>
    <!-- 첨부파일 -->
    <!-- <div v-for="file in Plan.file" :key="file">
      <p>첨부파일</p>
      <p>{{ file }}</p>
    </div> -->
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
    <p v-if="Plan.plan_approved == 'd2'">
      <material-button type="button" color="warning" disabled
        >승인 완료</material-button
      >
    </p>
    <p v-else-if="Plan.plan_approved == 'd1'">
      <material-button type="button" color="warning"
        >승인 대기 중</material-button
      ><material-button type="button" color="danger"
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
          <material-button type="button" @click="close">닫기</material-button>
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
</template>
