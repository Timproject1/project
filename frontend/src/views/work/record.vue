<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onBeforeMount } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";
import { useRoute } from "vue-router";
// export default { components: { MaterialInput } };
const route = useRoute();
//상담기록 출력
const records = ref([]);
const listrecord = async () => {
  let result = await axios
    .get(`http://localhost:3000/user/recordlist`)
    .catch((err) => console.log(err));
  records.value = (result.data.result || []).map((r) => ({
    ...r,
    file: r.file || [],
    showrecordDelete: false,
    modifyrecord: false,
    showRevision: false,
  }));
  console.log(result.data);
};

const revision = ref([]);
//수정 내역 출력
const revisions = async (id) => {
  let result = await axios
    .get(`http://localhost:3000/user/modifyRecordlist/${id.counsel_num}`)
    .catch((err) => console.log(err));
  revision.value = Array.isArray(result.data.result) ? result.data.result : [];
  id.showRevision = true;
};

onBeforeMount(() => {
  listrecord();
  let searchId = route.query.no;
  revisions(searchId);
});

const timedate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const today = ref(timedate());

const newrecord = ref(false);

//상담기록 추가
const addRecordName = ref("");
const addRecordContent = ref("");
const addrecord = async () => {
  console.log(addRecordName.value, addRecordContent.value);
  if (!addRecordName.value) {
    alert("제목을 입력해주세요");
    return;
  } else if (!addRecordContent.value) {
    alert("내용을 입력해주세요");
    return;
  }

  let add = {
    doc_num: "doc-1",
    counsel_title: addRecordName.value,
    counsel_content: addRecordContent.value,
    counsel_manager: "ca1",
  };

  const result = ref(null);
  try {
    const res = await axios.post("http://localhost:3000/user/record", add);
    console.log(res.data);
    result.value = res.data;
    addRecordName.value = "";
    addRecordContent.value = "";
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
  newrecord.value = false;
};

const draft = async () => {
  let savedate = {
    counsel_num: "coun-9999999",
    doc_num: records.value.doc_num,
    counsel_title: addRecordName.value,
    counsel_content: addRecordContent.value,
  };
  const result = ref(null);
  try {
    const res = await axios.post("http://localhost:3000/user/record", savedate);
    console.log(res.data);
    result.value = res.data;
    addRecordName.value = "";
    addRecordContent.value = "";
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
</script>
<template>
  <h4>상담기록</h4>
  <material-button type="button">임시저장 내용</material-button>
  <material-button type="button" @click="newrecord = true"
    >상담기록 추가</material-button
  >
  <!-- 상담기록 추가 모달 -->
  <Modal v-if="newrecord" @close="newrecord = false">
    <template #content>
      <material-input type="date" placeholder="내용입력" v-model="today" />
      <material-button type="button" size="sm" @click="draft()"
        >임시저장</material-button
      >
      <material-input
        id="text"
        placeholder="제목입력"
        v-model="addRecordName"
      />
      <material-input
        id="text"
        placeholder="내용입력"
        v-model="addRecordContent"
      />
      <material-button type="button">첨부파일 등록</material-button>
      <p>파일이름</p>
      <material-button type="button" @click="addrecord()">등록</material-button>
    </template>
    <template #actions="{ close }">
      <material-button type="button" @click="close">취소</material-button>
    </template>
  </Modal>
  <!-- 상담기록 내역 -->
  <div v-for="record in records" :key="record.counsel_num">
    <p>{{ timedate(record.counsel_date) }} {{ record.row_num }}번째 상담기록</p>
    <material-button type="button" size="sm" @click="record.modifyrecord = true"
      >수정</material-button
    >
    <material-button
      type="button"
      size="sm"
      @click="record.showrecordDelete = true"
      >삭제</material-button
    >
    <!-- 수정 모달 -->
    <Modal v-if="record.modifyrecord" @close="record.modifyrecord = false">
      <template #content>
        <material-input
          id="text"
          placeholder="제목입력"
          v-model="record.counsel_title"
        />
        <material-input
          id="text"
          placeholder="내용입력"
          v-model="record.counsel_content"
        />
        <material-button type="button">첨부파일 등록</material-button>
        <!-- <div v-if="record.file && record.file.length">
          <div v-for="file in record.file" :key="file">
            <p>첨부파일</p>
            <p>{{ file }}</p>
          </div>
        </div> -->
        <material-button type="button">수정 완료</material-button>
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">취소</material-button>
      </template>
    </Modal>
    <!-- 삭제 모달 -->
    <Modal
      v-if="record.showrecordDelete"
      @close="record.showrecordDelete = false"
    >
      <template #content>
        <p>해당 상담내용을 <br />삭제하시겠습니까?</p>
        <material-button type="button" color="danger">예</material-button>
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">아니오</material-button>
      </template>
    </Modal>
    <div>
      <p>{{ record.counsel_title }}</p>
      <br />
      <p>{{ record.counsel_content }}</p>
      <br />
    </div>
    <!-- <div v-if="record.file && record.file.length">
      <div v-for="file in record.file" :key="file">
        <p>첨부파일</p>
        <p>{{ file }}</p>
      </div>
    </div> -->
    <material-button type="button" size="sm" @click="revisions(record)"
      >수정내역 확인</material-button
    >
    <Modal v-if="record.showRevision" @close="record.showRevision = false">
      <template #actions="{ close }">
        <material-button type="button" @click="close">X</material-button>
      </template>
      <template #content>
        <table border="1px">
          <thead>
            <tr>
              <th>수정날짜</th>
              <th>이름</th>
              <th>수정내용</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="revisions in revision"
              :key="revisions.counsel_modifi_num"
            >
              <td>{{ timedate(revisions.counsel_modified_date) }}</td>
              <td>{{ revisions.counsel_modified_by }}</td>
              <td>{{ revisions.counsel_modified_comment }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Modal>
  </div>
</template>
<style scoped></style>
