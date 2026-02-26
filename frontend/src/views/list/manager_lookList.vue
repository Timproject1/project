<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
// 지원자 목록에 들어갈 정보
const supported = ref([
  {
    sup_num: 1,
    sup_name: "홍길동",
    progress: "계획",
    sup_req_date: "25.12.04",
    documents: "",
    plans: "",
    results: "",
  },
  {
    sup_num: 2,
    sup_name: "김철수",
    progress: "긴급",
    sup_req_date: "24.02.16",
    documents: "",
    plans: "",
    results: "",
  },
  {
    sup_num: 3,
    sup_name: "오영희",
    progress: "중점",
    sup_req_date: "24.10.16",
    documents: "",
    plans: "",
    results: "",
  },
]);
</script>
<template>
  <!-- 기관 담당자의 페이지 이동 탭 -->
  <div class="layout-wrapper">
    <aside class="sidebar-container">
      <div class="management-box">
        <div class="box-header" @click="toggleMenu">
          지원자 관리 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
        </div>
        <ul v-if="isOpen" class="menu-list">
          <li
            :class="{ active: currentTab === 'list' }"
            @click="router.push('/list/supported')"
          >
            지원자 목록
          </li>
        </ul>
      </div>
      <!-- 지원자목록의 검색창 -->
      <div class="search-box">
        <h3 class="search-title">지원자 검색</h3>
        <div class="search-form">
          <div class="form-group">
            <label>지원자 명</label>
            <input type="text" v-model="searchName" />
          </div>
          <div class="form-group">
            <label>성별</label>
            <div class="gender-btns">
              <label>대기단계</label>
              <button>전체</button>
              <button>계획</button>
              <button>중점</button>
              <button>긴급</button>
            </div>
          </div>
          <div class="form-group">
            <label>장애유형</label>
            <input type="text" />
          </div>
          <button class="search-btn" @click="resetSearch">검색</button>
        </div>
      </div>
    </aside>
  </div>
  <h2>기관 담당자의 지원자 목록</h2>
  <table>
    <thead>
      <tr>
        <td>번호</td>
        <td>지원자 명</td>
        <td>대기단계</td>
        <td>지원신청일</td>
        <td>신청서</td>
        <td>계획서</td>
        <td>결과서</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="member in supported" :key="member.sup_num">
        <td>{{ member.sup_num }}</td>
        <td>{{ member.sup_name }}</td>
        <td>{{ member.progress || "-" }}</td>
        <td><button>보기</button></td>
        <td><button>보기</button></td>
        <td><button>보기</button></td>
      </tr>
    </tbody>
  </table>
  <div class="pagination">
    <button>이전</button>
    <span class="pages">
      <span class="active">1</span> <span>2</span> <span>3</span>
    </span>
    <button>다음</button>
  </div>
</template>
