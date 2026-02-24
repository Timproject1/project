<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const supported = ref([
  {
    sup_num: 1,
    sup_name: "홍길동",
    priority: "계획",
    progress: "검토중",
    sup_reg_date: "25.12.04",
    plan_manager: "김하나",
  },
  {
    sup_num: 2,
    sup_name: "김철수",
    priority: "긴급",
    progress: "검토완료",
    sup_reg_date: "24.02.16",
    plan_manager: "강남구",
    documents: "",
    plans: "",
    results: "",
  },
  {
    sup_num: 3,
    sup_name: "오영희",
    priority: "중점",
    progress: "대기중",
    sup_reg_date: "23.03.05",
    plan_manager: "허길동",
    documents: "",
    plans: "",
    results: "",
  },
  {
    sup_num: 4,
    sup_name: "최00",
    priority: "대기",
    progress: "검토중",
    sup_reg_date: "23.03.21",
    plan_manager: "박00",
    documents: "",
    plans: "",
    results: "",
  },
  {
    sup_num: 5,
    sup_name: "박00",
    priority: "긴급",
    progress: "검토완료",
    sup_reg_date: "22.03.05",
    plan_manager: "허길동",
    documents: "",
    plans: "",
    results: "",
  },
  {
    sup_num: 6,
    sup_name: "홍00",
    priority: "계획",
    progress: "대기중",
    sup_reg_date: "22.10.05",
    plan_manager: "김하나",
    documents: "",
    plans: "",
    results: "",
  },
]);
</script>
<template>
  <div class="layout-wrapper">
    <aside class="sidebar-container">
      <div class="management-box">
        <div class="box-header" @click="toggleMenu">
          지원자 관리 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
        </div>
        <ul v-if="isOpen" class="menu-list">
          <li
            :class="{ active: currentTab === 'list' }"
            @click="router.push('/list/list')"
          >
            - 지원자 목록
          </li>
          <li
            class="sub-item"
            :class="{ active: currentTab === 'info' }"
            @click="router.push('/list/info')"
          >
            - 지원자 정보
          </li>
        </ul>
      </div>

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
              <button class="active">전체</button>
              <button>남성</button>
              <button>여성</button>
            </div>
          </div>
          <div class="form-group">
            <label>장애유형</label>
            <input type="text" />
          </div>
          <div class="form-group">
            <label>담당자</label>
            <input type="text" v-model="counsel_manager" />
          </div>
          <button class="search-btn" @click="resetSearch">검색</button>
        </div>
      </div>
    </aside>
    <div class="content">
      <div class="header-section">
        <h2>지원자 목록</h2>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>대기단계</th>
              <th>최근 서류작성일</th>
              <th>작성 서류상태</th>
              <th>담당자 배정일</th>
              <th>담당자</th>
              <th>신청서</th>
              <th>계획서</th>
              <th>결과서</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in supported" :key="member.sup_num">
              <td>{{ member.sup_num }}</td>
              <td>{{ member.sup_name }}</td>
              <td>{{ member.priority }}</td>
              <td>{{ member.sup_reg_date }}</td>
              <td>{{ member.progress }}</td>
              <td>{{ member.sup_reg_date }}</td>
              <td>{{ member.plan_manager }}</td>
              <td>{{ member.documents || "-" }}</td>
              <td>{{ member.plans || "-" }}</td>
              <td>{{ member.results || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button>이전</button>
        <span class="pages">
          <span class="active">1</span> <span>2</span> <span>3</span>
        </span>
        <button>다음</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content {
  flex: 0 1 auto;
  width: 100%;
  max-width: 1050px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
}
.header-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.table-wrapper {
  border: 1px solid #000000;
  border-radius: 4px;
}
table {
  width: 100px;
  table-layout: fixed;
  border-collapse: collapse;
  table-layout: auto;
  text-align: left;
  min-width: 1000px;
}
th {
  background-color: #76abe0;
  color: #333;
  font-weight: 500;
  padding: 8px 4px;
  border-bottom: 2px solid #000000;
  border-left: 1px solid #000000;
  text-align: center;
}
td {
  padding: 8px 4px;
  border-bottom: 1px solid #000000;
  color: #444;
  border-left: 1px solid #030303;
  text-align: center;
}
.pagination {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 15px;
  flex-shrink: 0;
}
.search-form input {
  width: 100%;
  box-sizing: border-box;
}

/* 1. 지원자 관리 (노란색) */
.management-box {
  background-color: #fdfdb1;
  border: 1px solid #080808;
  padding: 15px;
  margin-bottom: 20px;
}
.box-header {
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 10px;
}
.menu-list {
  list-style: none;
  padding-left: 5px;
}
.menu-list li {
  cursor: pointer;
  margin-bottom: 5px;
}
.sub-item {
  padding-left: 10px;
}

/* 2. 지원자 검색 (파란색) */
.search-box {
  background-color: #cfe2f3;
  border: 1px solid #999;
  padding: 15px;
}
.search-title {
  font-size: 1rem;
  margin-bottom: 15px;
}
.form-group {
  margin-bottom: 10px;
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 4px;
  border: 1px solid #999;
}

.gender-btns {
  display: flex;
  gap: 2px;
}
.gender-btns button {
  flex: 1;
  padding: 2px;
  font-size: 0.75rem;
  background: #fff;
  border: 1px solid #999;
}
.gender-btns button.active {
  background: #54b066;
}

.search-btn {
  width: 100%;
  margin-top: 10px;
  background-color: #b6d7a8;
  padding: 5px;
  border: 1px solid #999;
}
.layout-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 20px; /* 사이 간격을 조금 좁혔습니다 */
  padding: 20px;
  width: 100%;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
}

.sidebar-container {
  width: 220px;
  flex-shrink: 0;
}
</style>
