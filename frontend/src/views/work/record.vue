<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onBeforeMount } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";
// import { useRoute } from "vue-router";
// export default { components: { MaterialInput } };
// const route = useRoute();
import { useMemberStore } from "@/store/member";
import { useDocStore } from "../../store/doc";

const memberStore = useMemberStore();
const docStore = useDocStore();
//상담기록 출력
const records = ref([]);
console.log(records);
const listrecord = async () => {
  let doc = docStore.doc_num;
  let result = await axios
    .get(`http://localhost:3000/document/recordlist/${doc}`)
    .catch((err) => console.log(err));
  records.value = (result.data.result || []).map((r) => ({
    ...r,
    file: r.file || [],
    showrecordDelete: false,
    modifyrecord: false,
    showRevision: false,
    revision: [],
  }));
};

//수정 내역 출력
const revisions = async (id) => {
  // console.log(id);
  try {
    let result = await axios
      .get(`http://localhost:3000/document/modifyRecordlist/${id.counsel_num}`)
      .catch((err) => console.log(err));
    id.revision = Array.isArray(result.data.result) ? result.data.result : [];
    id.showRevision = true;
  } catch {
    id.revision = [];
    id.showRevision = true;
  }
};

onBeforeMount(() => {
  listrecord();
  filelist();
  // let searchId = route.query.no;
  // revisions(searchId);
});

const timedate = (id) => {
  const today = id ? new Date(id) : new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const today = ref(timedate(new Date()));

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
    doc_num: docStore.doc_num,
    counsel_title: addRecordName.value,
    counsel_content: addRecordContent.value,
    counsel_manager: memberStore.id,
  };

  const result = ref(null);
  try {
    const res = await axios.post("http://localhost:3000/document/record", add);
    console.log(res.data);
    result.value = res.data;
    addRecordName.value = "";
    addRecordContent.value = "";
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
  newrecord.value = false;
};
//임시저장
const draft = async () => {
  let savedate = {
    counsel_num: "coun-9999999",
    doc_num: docStore.doc_num,
    counsel_title: addRecordName.value,
    counsel_content: addRecordContent.value,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/saverecord",
      savedate,
    );
    console.log(res.data);
    result.value = res.data;
    addRecordName.value = "";
    addRecordContent.value = "";
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};

//임시저장 불러오기
const sevedate = async () => {
  let result = await axios
    .post(`http://localhost:3000/document/bringrecord`)
    .catch((err) => console.log(err));

  const data = result.data;
  newrecord.value = true;
  addRecordName.value = data.result[0].counsel_title;
  addRecordContent.value = data.result[0].counsel_content;
  console.log(data.result);
};

const closeModal = () => {
  newrecord.value = false;
  addRecordName.value = "";
  addRecordContent.value = "";
};
//수정완료
const original = ref([]);
const openresmodal = (res) => {
  original.value = { ...res };
  res.modifyrecord = true;
};
const recordcomment = ref("");
const Update = async (id) => {
  const columns = [];
  console.log(id);
  for (let key of Object.keys(id)) {
    // 수정 가능한 필드만 체크
    if (["counsel_title", "counsel_content"].includes(key)) {
      // console.log(id);
      if (id[key] !== original.value[key]) {
        columns.push(key);
      }
    }
  }

  let updatedate = {
    counsel_title: id.counsel_title,
    counsel_content: id.counsel_content,
    counsel_num: id.counsel_num,
    counsel_modified_by: memberStore.id,
    counsel_modified_comment: recordcomment.value,
    counsel_modified_title: columns.join(","),
    counsel_modified_content: id.counsel_content,
  };
  console.log(id);
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/Updaterecord",
      updatedate,
    );
    console.log(res.data);
    result.value = res.data;
    id.modifyrecord = false;
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//삭제
const delRecord = async (id) => {
  let del = {
    counsel_num: id.counsel_num,
  };
  const result = ref(null);
  try {
    const res = await axios.post(
      "http://localhost:3000/document/deleterecord",
      del,
    );
    console.log(res.data);
    result.value = res.data;
    records.value.showrecordDelete = false;
    location.reload();
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
//파일리스트
const filename = ref([]);
console.log(filename);
const filelist = async () => {
  let result = await axios
    .get(`http://localhost:3000/document/recordFile`)
    .catch((err) => console.log(err));
  console.log(result.data.result);
  filename.value = Array.isArray(result.data.result) ? result.data.result : [];
};
</script>
<template>
  <div class="work-section-card card shadow-lg border-0 border-radius-xl">
    <div class="work-section-header d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold text-dark">상담기록</h4>
      <div class="work-section-header-actions">
        <material-button type="button" size="sm" @click="sevedate()"
          >임시저장 내용</material-button
        >
        <material-button type="button" size="sm" color="info" @click="newrecord = true"
          >상담기록 추가</material-button
        >
      </div>
    </div>

    <!-- 상담기록 추가 모달 -->
    <Modal v-if="newrecord" @close="closeModal()">
      <template #content>
        <material-input
          id="date"
          type="date"
          placeholder="내용입력"
          v-model="today"
        />
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
        <material-button type="button" color="success" @click="addrecord()"
          >등록</material-button
        >
      </template>
      <template #actions="{ close }">
        <material-button
          type="button"
          @click="
            () => {
              addRecordName = '';
              addRecordContent = '';
              close();
            }
          "
          >취소</material-button
        >
      </template>
    </Modal>

    <!-- 상담기록 내역 -->
    <div
      v-for="record in records"
      :key="record.counsel_num"
      class="record-item border rounded-3 p-3 mb-3 bg-white"
    >
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="mb-0 text-sm text-secondary">
          {{ timedate(record.counsel_date) }} · {{ record.row_num }}번째 상담기록
        </p>
        <div class="d-flex gap-2">
          <material-button type="button" size="sm" color="info" @click="openresmodal(record)"
            >수정</material-button
          >
          <material-button
            type="button"
            size="sm"
            color="danger"
            @click="record.showrecordDelete = true"
            >삭제</material-button
          >
        </div>
      </div>

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
          <material-input
            id="text"
            placeholder="수정사유"
            v-model="recordcomment"
          />
          <material-button type="button" color="success" @click="Update(record)"
            >수정 완료</material-button
          >
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
          <p class="mb-3">
            해당 상담내용을 <br />삭제하시겠습니까?
          </p>
          <material-button type="button" color="danger" @click="delRecord(record)"
            >예</material-button
          >
        </template>
        <template #actions="{ close }">
          <material-button type="button" @click="close">아니오</material-button>
        </template>
      </Modal>

      <div class="mt-2">
        <p class="fw-semibold mb-1">{{ record.counsel_title }}</p>
        <p class="mb-2">{{ record.counsel_content }}</p>
      </div>

      <!-- 첨부파일 -->
      <div class="mt-2">
        <p class="text-sm text-secondary mb-1">첨부파일</p>
        <div
          v-for="file in filename.filter(
            (f) => f.counsel_num === record.counsel_num,
          )"
          :key="file.file_num"
          class="text-sm"
        >
          <p class="mb-0">{{ file.origin_name }}</p>
        </div>
      </div>

      <div class="mt-2">
        <material-button type="button" size="sm" @click="revisions(record)"
          >수정내역 확인</material-button
        >
        <Modal v-if="record.showRevision" @close="record.showRevision = false">
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
                  v-for="revisions in record.revision"
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
</style>
