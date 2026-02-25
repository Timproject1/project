<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, reactive } from "vue";
import Modal from "./modal.vue";
import MaterialInput from "@/components/MaterialInput.vue";

const results = reactive([
  {
    count: 1,
    date: "2026-02-24",
    resultName: "결과제목",
    resultContent: "내용",
    file: ["파일1.png", "파일2.jpg"],
    showResultDelete: false,
    app: "승인 완료",
    modifyResult: false,
  },
  {
    count: 2,
    date: "2026-02-24",
    resultName: "결과제목",
    resultContent: "내용",
    file: ["파일3.png"],
    showResultDelete: false,
    app: "승인 대기 중",
    modifyResult: false,
  },
  {
    count: 3,
    date: "2026-02-24",
    resultName: "결과제목",
    resultContent: "내용",
    file: ["파일4.png"],
    showResultDelete: false,
    app: "승인 재요청",
    modifyResult: false,
  },
  {
    count: 3,
    date: "2026-02-24",
    resultName: "결과제목",
    resultContent: "내용",
    file: ["파일4.png"],
    showResultDelete: false,
    app: "반려",
    modifyResult: false,
  },
]);

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const day = ref(`${yyyy}-${mm}-${dd}`);

const newresult = ref(false);

const revision = reactive([
  {
    date: "2026-02-24",
    id: "김길동",
    comment: "내용수정",
    revisionResult: false,
  },
  {
    date: "2026-02-24",
    id: "이길동",
    comment: "제목수정",
    revisionResult: false,
  },
  {
    date: "2026-02-24",
    id: "홍길동",
    comment: "첨부파일수정",
    revisionResult: false,
  },
]);

const returnResult = ref(false);
const returnResultContent = ref("어림도없지");
</script>
<template>
  <h4>지원결과서</h4>
  <material-button type="button">임시저장 내용</material-button>
  <material-button type="button" @click="newresult = true"
    >지원결과서 추가</material-button
  >
  <!-- 지원결과서 추가 모달 -->
  <Modal v-if="newresult" @close="newresult = false">
    <template #content>
      <p>{{ day }}</p>
      <material-button type="button" size="sm">임시저장</material-button>
      <material-input id="text" placeholder="결과제목" />
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
  <div v-for="result in results" :key="result.count">
    <p>{{ result.date }} 지원계획 {{ result.count }}</p>
    <material-button type="button" size="sm" @click="result.modifyResult = true"
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
          :value="`${result.resultName}`"
        />
        <material-input
          id="text"
          placeholder="내용입력"
          :value="`${result.resultContent}`"
        />
        <material-input id="text" placeholder="수정사유" />
        <material-button type="button">첨부파일 등록</material-button>
        <div v-for="file in result.file" :key="file">
          <p>{{ file }}</p>
        </div>
        <material-button type="button">수정 완료</material-button>
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
        <material-button type="button" color="danger">예</material-button>
      </template>
      <template #actions="{ close }">
        <material-button type="button" @click="close">아니오</material-button>
      </template>
    </Modal>
    <div>
      <!-- 목표 및 내용 출력 -->
      <h4>{{ result.resultName }}</h4>
      <br />
      <p>{{ result.resultContent }}</p>
      <br />
    </div>
    <!-- 첨부파일 -->
    <div v-for="file in result.file" :key="file">
      <p>첨부파일</p>
      <p>{{ file }}</p>
    </div>
    <!-- 수정내역 -->
    <material-button
      type="button"
      size="sm"
      @click="revision.revisionResult = true"
      >수정내역 확인</material-button
    >
    <Modal
      v-if="revision.revisionResult"
      @close="revision.revisionResult = false"
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
    <p v-if="result.app == '승인 완료'">
      <material-button type="button" color="warning" disabled
        >승인 완료</material-button
      >
    </p>
    <p v-else-if="result.app == '승인 대기 중'">
      <material-button type="button" color="warning"
        >승인 대기 중</material-button
      ><material-button type="button" color="danger"
        >승인 요청 취소</material-button
      >
    </p>
    <p v-else-if="result.app == '반려'">
      <material-button
        type="button"
        color="warning"
        @click="returnResult = true"
        >반려</material-button
      >
      <Modal v-if="returnResult" @close="returnResult = false">
        <template #content>
          <h4>반려 사유</h4>
          <p>{{ returnResultContent }}</p>
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
