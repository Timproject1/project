<script setup>
import { ref } from "vue";

const isOpen = ref(true);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const userInfo = ref([
  {
    user_id: "test_id_01",
    user_name: "김길동",
    user_email: "test@naver.com",
    user_ref_date: "2024-05-22",
  },
  {
    user_id: "test_02",
    user_name: "박수진",
    user_email: "test123@naver.com",
    user_ref_date: "2025-06-22",
  },
  {
    user_id: "test_03",
    user_name: "김현종",
    user_email: "user031@naver.com",
    user_ref_date: "2026-03-12",
  },
]);

const choiceUser = ref(null);
// 회원 상세 정보 표시
const showInfo = ref(true);
// 반려사유 입력창
const Noapprove = ref(false);
const Reason = ref("");

// 등록 버튼 클릭
const viewInfo = (user) => {
  choiceUser.value = user;
  showInfo.value = false;
  Noapprove.value = false;
};
// 승인 버튼 클릭 시 나오는 메세지
const Okapprove = () => {
  alert(`${choiceUser.value.user_name} 님을 승인 하였습니다`);
  showInfo.value = true;
};
// 반려 버튼 부분
const reasonModal = () => {
  Noapprove.value = true;
};
// 반려 사유 입력 부분
const confirmReject = () => {
  if (!Reason.value) return alert("반려 사유를 입력하세요");
  userInfo.value = userInfo.value.filter(
    (user) => user.user_id !== choiceUser.value.user_id,
  );
  Noapprove.value = false;
  showInfo.value = true;
  Reason.value = "";
};
</script>
<template>
  <h2>일반 회원 승인신청목록</h2>
  <div class="layout-wrapper">
    <aside class="sidebar-container">
      <div class="management-box">
        <div class="box-header" @click="toggleMenu">
          마이페이지 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
        </div>
        <ul v-if="isOpen" class="menu-list">
          <li>일반회원 관리</li>
        </ul>
      </div>
    </aside>
  </div>
  <table>
    <thead class="user_table">
      <tr>
        <th>번호</th>
        <th>아이디</th>
        <th>이름</th>
        <th>이메일 주소</th>
        <th>가입 신청일</th>
        <th>확인하기</th>
      </tr>
    </thead>
  </table>
  <tbody v-if="showInfo">
    <tr v-for="(user, index) in userInfo" :key="user.user_id">
      <td>{{ index + 1 }}</td>
      <td>{{ user.user_id }}</td>
      <td>{{ user.user_name }}</td>
      <td>{{ user.user_email }}</td>
      <td>{{ user.user_ref_date }}</td>
      <td><button @click="viewInfo(user)">등록</button></td>
    </tr>
  </tbody>
  <!-- 등록 버튼 클릭 시 회원 승인 여부 부분 -->
  <div v-else class="detail-container">
    <div v-if="!Noapprove">
      <h3>회원 상세정보</h3>
      <div>
        <p>아이디: {{ choiceUser.user_id }}</p>
        <p>이름: {{ choiceUser.user_name }}</p>
        <p>이메일: {{ choiceUser.user_email }}</p>
        <p>연락처: {{ choiceUser.user_tel }}</p>
      </div>
      <button @click="Okapprove" class="btn-ok">승인</button>
      <button @click="reasonModal" class="btn-no">반려</button>
    </div>
    <!-- 회원 승인 반려 시 입력하는 부분 -->
    <div v-if="Noapprove" class="modal-overlay">
      <div class="modal-content">
        <h4>반려 사유입력</h4>
        <textarea
          v-model="Reason"
          placeholder="반려 사유를 입력하세요"
        ></textarea>
        <button @click="confirmReject">확인</button>
        <button @click="Noapprove = false">취소</button>
      </div>
    </div>
  </div>
</template>
