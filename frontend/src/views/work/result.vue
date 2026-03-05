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
// console.log(docStore.doc_num);
//지원결과서 출력
const results = ref([]);
const listresult = async () => {
  let doc = docStore.doc_num;
  let result = await axios
    .get(`http://localhost:3000/document/resultlist/${doc}`)
    .catch((err) => console.log(err));

  results.value = (result.data.result || []).map((r) => ({
    ...r,
    file: r.file || [],
    showResultDelete: false,
    modifyResult: false,
    showRevision: false,
    revision: [],
  }));
  console.log(results.value);
};

onBeforeMount(() => {
  listresult();
  filelist();
});
const revisions = async (id) => {
  // console.log(id);
  try {
    let result = await axios
      .get(`http://localhost:3000/document/modifyResultlist/${id.result_num}`)
      .catch((err) => console.log(err));
    id.revision = Array.isArray(result.data.result) ? result.data.result : [];
    id.showRevision = true;
  } catch {
    id.revision = [];
    id.showRevision = true;
  }
};
//지원결과서 추가
const addresultsName = ref("");
const addresultsContent = ref("");
const addresults = async () => {
  console.log(addresultsName.value, addresultsContent.value);
  if (!addresultsName.value) {
    alert("제목을 입력해주세요");
    return;
  } else if (!addresultsContent.value) {
    alert("내용을 입력해주세요");
    return;
  }

  let add = {
    progress: "d5",
    doc_num: docStore.doc_num,
    result_manager: "ca1",
    result_title: addresultsName.value,
    result_contnet: addresultsContent.value,
  };

  const result = ref(null);
  try {
    const res = await axios.post("http://localhost:3000/document/result", add);
    console.log(res.data);
    result.value = res.data;
    addresultsName.value = "";
    addresultsContent.value = "";
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
  newresult.value = false;
};

//지원결과서 수정
const original = ref([]);
const openresmodal = (res) => {
  original.value = { ...res };
  res.modifyResult = true;
};
const resreason = ref("");
const Update = async (id) => {
  const columns = [];

  for (let key of Object.keys(id)) {
    // 수정 가능한 필드만 체크
    if (["result_title", "result_contnet"].includes(key)) {
      console.log(key);
      if (id[key] !== original.value[key]) {
        columns.push(key);
      }
    }
  }

  let updatedate = {
    result_title: id.result_title,
    result_contnet: id.result_contnet,
    result_num: id.result_num,
    result_modified_by: "ca1",
    result_modified_comment: resreason.value,
    result_modified_title: columns.join(","),
    result_modified_content: id.result_contnet,
  };
  console.log(id);
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/updateresult",
      updatedate,
    );
    console.log(res.data);
    result.value = res.data;
    id.modifyResult = false;
    // location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//임시저장
const draft = async () => {
  let savedate = {
    result_num: "result-9999999",
    doc_num: docStore.doc_num,
    result_title: addresultsName.value,
    result_content: addresultsContent.value,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/saveresult",
      savedate,
    );
    console.log(res.data);
    result.value = res.data;
    addresultsName.value = "";
    addresultsContent.value = "";
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//임시저장 불러오기
const sevedate = async () => {
  let result = await axios
    .post(`http://localhost:3000/document/bringresult`)
    .catch((err) => console.log(err));

  const data = result.data;
  newresult.value = true;
  addresultsName.value = data.result[0].result_title;
  addresultsContent.value = data.result[0].result_content;
  console.log(data.result[0]);
};

const timedate = (id) => {
  const today = id ? new Date(id) : new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
//삭제
const delresult = async (id) => {
  let del = {
    result_num: id.result_num,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/deleteresult",
      del,
    );
    console.log(res.data);
    result.value = res.data;
    results.value.showResultDelete = false;
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
const newresult = ref(false);
//파일리스트
const filename = ref([]);
console.log(filename);
const filelist = async () => {
  let result = await axios
    .get(`http://localhost:3000/document/resultFile`)
    .catch((err) => console.log(err));
  console.log(result.data.result);
  filename.value = Array.isArray(result.data.result) ? result.data.result : [];
};
</script>
<template>
  <h4>지원결과서</h4>
  <material-button type="button" @click="sevedate()"
    >임시저장 내용</material-button
  >
  <material-button type="button" @click="newresult = true"
    >지원결과서 추가</material-button
  >
  <!-- 지원결과서 추가 모달 -->
  <Modal v-if="newresult" @close="newresult = false">
    <template #content>
      <p>{{ timedate() }}</p>
      <material-button type="button" size="sm" @click="draft()"
        >임시저장</material-button
      >
      <material-input
        id="text"
        placeholder="결과제목"
        v-model="addresultsName"
      />
      <material-input
        id="text"
        placeholder="내용입력"
        v-model="addresultsContent"
      />
      <material-button type="button">첨부파일 등록</material-button>
      <p>파일이름</p>
      <material-button type="button" @click="addresults()"
        >등록</material-button
      >
    </template>
    <template #actions="{ close }">
      <material-button
        type="button"
        @click="
          () => {
            addresultsName = '';
            addresultsContent = '';
            close();
          }
        "
        >취소</material-button
      >
    </template>
  </Modal>
  <!-- 지원결과서 출력 -->
  <div v-for="result in results" :key="result.result_num">
    <p>{{ timedate(result.result_date) }} 지원결과 {{ result.row_num }}</p>
    <material-button type="button" size="sm" @click="openresmodal(result)"
      >수정</material-button
    >
    <material-button
      type="button"
      size="sm"
      @click="result.showResultDelete = true"
      >삭제</material-button
    >
    <!-- 수정 모달 -->
    <modal v-if="result.modifyResult" @close="result.modifyResult = false">
      <template #content>
        <material-input
          id="text"
          placeholder="제목입력"
          v-model="result.result_title"
        />
        <material-input
          id="text"
          placeholder="내용입력"
          v-model="result.result_contnet"
        />
        <material-input id="text" placeholder="수정사유" v-model="resreason" />
        <!-- <material-button type="button">첨부파일 등록</material-button>
        <div v-for="file in result.file" :key="file">
          <p>{{ file }}</p>
        </div> -->
        <material-button type="button" @click="Update(result)"
          >수정 완료</material-button
        >
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">취소</material-button>
      </template>
    </modal>
    <!-- 삭제 모달 -->
    <Modal
      v-if="result.showResultDelete"
      @close="result.showResultDelete = false"
    >
      <template #content>
        <p>해당 지원계획서를 <br />삭제하시겠습니까?</p>
        <material-button type="button" color="danger" @click="delresult(result)"
          >예</material-button
        >
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">아니오</material-button>
      </template>
    </Modal>
    <div>
      <!-- 목표 및 내용 출력 -->
      <h4>{{ result.result_title }}</h4>
      <br />
      <p>{{ result.result_contnet }}</p>
      <br />
    </div>
    <!-- 첨부파일 -->
    <p>첨부파일</p>
    <div
      v-for="file in filename.filter((f) => f.result_num === result.result_num)"
      :key="file.result_num"
    >
      <p>{{ file.origin_name }}</p>
    </div>
    <!-- 수정내역 -->
    <material-button type="button" size="sm" @click="revisions(result)"
      >수정내역 확인</material-button
    >
    <Modal v-if="result.showRevision" @close="result.showRevision = false">
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
              v-for="revisions in result.revision"
              :key="revisions.result_modifi_num"
            >
              <td>{{ timedate(revisions.result_modified_date) }}</td>
              <td>{{ revisions.result_modified_by }}</td>
              <td>{{ revisions.result_modified_comment }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Modal>
  </div>
</template>
