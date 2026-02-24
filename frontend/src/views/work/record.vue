<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, reactive } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
// export default { components: { MaterialInput } };
const records = reactive([
  {
    count: 1,
    date: "2026-02-24",
    recordName: "상담기록 제목",
    recordContent: "상담기록내용",
    file: ["파일1.png", "파일2.jpg"],
    showrecordDelete: false,
  },
  {
    count: 2,
    date: "2026-02-24",
    recordName: "상담기록 제목",
    recordContent: "상담기록내용",
    file: ["파일3.png"],
    showrecordDelete: false,
  },
  {
    count: 3,
    date: "2026-02-24",
    recordName: "상담기록 제목",
    recordContent: "상담기록내용",
    file: ["파일4.png"],
    showrecordDelete: false,
  },
]);
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const day = ref(`${yyyy}-${mm}-${dd}`);

const newrecord = ref(false);
const modifyrecord = ref(false);
const revision = reactive([
  {
    date: "2026-02-24",
    id: "김길동",
    comment: "내용수정",
    revisionrecord: false,
  },
  {
    date: "2026-02-24",
    id: "이길동",
    comment: "제목수정",
    revisionrecord: false,
  },
  {
    date: "2026-02-24",
    id: "홍길동",
    comment: "첨부파일수정",
    revisionrecord: false,
  },
]);
</script>
<template>
  <h4>상담기록</h4>
  <material-button type="button">임시저장 내용</material-button>
  <material-button type="button" @click="newrecord = true"
    >상담기록 추가</material-button
  >
  <Modal v-if="newrecord" @close="newrecord = false">
    <template #content>
      <input type="date" v-model="day" />
      <material-button type="button" size="sm">임시저장</material-button>
      <material-input id="text" placeholder="제목입력" />
      <material-input id="text" placeholder="내용입력" />
      <material-button type="button">첨부파일 등록</material-button>
      <p>파일이름</p>
      <material-button type="button">등록</material-button>
    </template>
    <template #actions="{ close }">
      <material-button type="button" @click="close">취소</material-button>
    </template>
  </Modal>
  <div v-for="record in records" :key="record.count">
    <p>{{ record.date }} {{ record.count }}번째 상담기록</p>
    <material-button type="button" size="sm" @click="modifyrecord = true"
      >수정</material-button
    >
    <material-button
      type="button"
      size="sm"
      @click="record.showrecordDelete = true"
      >삭제</material-button
    >
    <modal v-if="modifyrecord" @close="modifyrecord = false">
      <template #content>
        <material-input
          id="text"
          placeholder="제목입력"
          :value="`${record.recordName}`"
        />
        <material-input
          id="text"
          placeholder="내용입력"
          :value="`${record.recordContent}`"
        />
        <material-button type="button">첨부파일 등록</material-button>
        <div v-for="file in record.file" :key="file">
          <p>{{ file }}</p>
        </div>
        <material-button type="button">수정 완료</material-button>
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">취소</material-button>
      </template>
    </modal>
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
      <h4>{{ record.recordName }}</h4>
      <br />
      <p>{{ record.recordContent }}</p>
      <br />
    </div>
    <div v-for="file in record.file" :key="file">
      <p>첨부파일</p>
      <p>{{ file }}</p>
    </div>
    <material-button
      type="button"
      size="sm"
      @click="revision.revisionrecord = true"
      >수정내역 확인</material-button
    >
    <Modal
      v-if="revision.revisionrecord"
      @close="revision.revisionrecord = false"
    >
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
  </div>
</template>
<style scoped></style>
