<script setup>
import { ref } from "vue";
const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const Notsupported = ref([
  {
    sup_num: 1,
    sup_name: "이현정",
    sup_reg_date: "26.02.05",
    sup_approved: "미배정",
  },
  {
    sup_num: 2,
    sup_name: "김나은",
    sup_reg_date: "25.12.28",
    sup_approved: "미배정",
  },
  {
    sup_num: 3,
    sup_name: "김길동",
    sup_reg_date: "25.11.18",
    sup_approved: "미배정",
  },
]);

// 검색창 부분

// 지원자 명 검색
const searchName = ref("");

// 담당자 배정 요청 버튼
</script>
<template>
  <h1>기관담당자 배정</h1>
  <aside class="sidebar-container">
    <div class="management-box">
      <div class="box-header" @click="toggleMenu">
        기관관리 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
      </div>
      <ul v-if="isOpen" class="menu-list">
        <li
          :class="{ active: currentTab === 'list' }"
          @click="router.push('/list/supported')"
        >
          담당자 배정
        </li>
      </ul>
    </div>
    <!-- 담당자 미배정 지원자목록의 검색창 -->
    <div class="search-box">
      <h3 class="search-title">지원자 검색</h3>
      <div class="search-form">
        <div class="form-group">
          <label>지원자 명</label>
          <input type="text" v-model="searchName" />
        </div>
        <button class="search-btn" @click="resetSearch">검색</button>
      </div>
    </div>
  </aside>
  <h2>담당자 미 배정 회원목록</h2>
  <thead>
    <tr>
      <th>번호</th>
      <th>지원자명</th>
      <th>가입일</th>
      <th>현재상태</th>
      <th>배정</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="member in Notsupported" :key="member.sup_num">
      <td>{{ member.sup_num }}</td>
      <td>{{ member.sup_name }}</td>
      <td>{{ member.sup_reg_date }}</td>
      <td>{{ member.sup_approved }}</td>
      <td><button>배정하기</button></td>
    </tr>
  </tbody>
  <div class="pagination">
    <button>이전</button>
    <span class="pages">
      <span class="active">1</span> <span>2</span> <span>3</span>
    </span>
    <button>다음</button>
  </div>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-contnet">
      <h3>담당자 목록</h3>
      <thead>
        <tr>
          <td>번호</td>
          <td>담당자명</td>
          <td>배정인원수</td>
          <td>근무상태</td>
          <td>선택</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="manager in managerList" :key="manager.user_id">
          <td></td>
        </tr>
      </tbody>
    </div>
  </div>
</template>
