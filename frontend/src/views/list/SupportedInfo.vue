<script setup>
import { ref } from "vue";
//import { useRouter } from "vue-router";
//const router = useRouter();
const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// 장애 유형을 보는 모달창
const detailModal = ref(false);
const selectMember = ref(null);

// 지원자 추가
const addModal = ref(false);

// 장애 유형 보기 버튼 제어
const openDetailModal = (member) => {
  selectMember.value = member;
  detailModal.value = true;
};
// 장애 유형 버튼 닫기
const closeDetailModal = () => {
  detailModal.value = false;
  selectMember.value = null;
};
// 지원자 추가 버튼 제어
const openAddModal = () => {
  addModal.value = true;
};
const closeAddModal = () => {
  addModal.value = false;
};

// 지원자 목록 데이터 부분
// DB연동을 아직 안해서 작성함 지원자 목록과 지원자 정보 부분의 DB연결 후 아래의 내용은 삭제하기
const supported = ref([
  {
    sup_num: 1,
    sup_name: "홍길동",
    sup_gender: "남성",
    sup_birthday: "2000.12.03",
    sup_tel: "010-1234-5678",
    sup_address: "대구광역시 00구 00동",

    manager: "김하나",
    sup_reg_date: "25.12.04",
  },
  {
    sup_num: 2,
    sup_name: "김철수",
    sup_gender: "남성",
    sup_birthday: "1999.06.20",
    sup_tel: "010-4567-8910",
    sup_address: "대전광역시 00구 00동",

    sup_reg_date: "25.12.16",
  },
  {
    sup_num: 3,
    sup_name: "오영희",
    sup_gender: "여성",
    sup_birthday: "1989.03.04",
    sup_tel: "010-1234-7894",
    sup_address: "부산광역시 00구 00동",

    manager: "허길동",
    sup_reg_date: "25.10.05",
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
            @click="currentTab = 'list'"
          >
            - 지원자 목록
          </li>
          <li
            class="sub-item"
            :class="{ active: currentTab === 'info' }"
            @click="currentTab = 'info'"
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
        <button class="add-btn" @click="openAddModal">지원자 추가</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>성별</th>
              <th>생년월일</th>
              <th>휴대폰 번호</th>
              <th>주소</th>
              <th>장애유형</th>
              <th>담당자명</th>
              <th>지원자 등록일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in supported" :key="member.sup_num">
              <td>{{ member.sup_num }}</td>
              <td>{{ member.sup_name }}</td>
              <td>{{ member.sup_gender }}</td>
              <td>{{ member.sup_birthday }}</td>
              <td>{{ member.sup_tel }}</td>
              <td>{{ member.sup_address }}</td>
              <td>
                <button class="view-btn" @click="openDetailModal(member)">
                  보기
                </button>
              </td>
              <td>{{ member.manager }}</td>
              <td>{{ member.sup_reg_date }}</td>
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
  <!-- 모달창 부분 -->
  <!-- 지원자의 장애 유형 보는 모달 창 -->
  <div v-if="detailModal" class="modal-overlay">
    <div class="modal-content">
      <h3>장애 유형</h3>
      <p><span>지원자명</span></p>
      <p><span>등록한 장애유형</span></p>
      <button class="close-btn" @click="closeDetailModal">닫기</button>
    </div>
  </div>
  <!-- 지원자 추가 모달창 -->
  <div v-if="addModal" class="modal-overlay">
    <div class="modal-content">
      <h3>지원자 추가</h3>
      <div>
        <p><span>지원자명</span><input type="text" v-model="sup_name" /></p>
      </div>
      <div>
        <p>
          <span>생년월일</span><input type="number" v-model="sup_birthday" />
        </p>
      </div>
      <div>
        <span>성별</span>
        <label style="margin-right: 15px"
          ><input type="radio" v-model="sup_gender" value="남성" /> 남성</label
        >
        <label
          ><input type="radio" v-model="sup_gender" value="여성" />여성</label
        >
      </div>
      <button class="close-btn" @click="closeAddModal">저장</button>
    </div>
  </div>
</template>
<style>
/* 메인 부분 */
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
  justify-content: space-between;
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
/* 사이드 부분 (검색창, 지원자 관리) */
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
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.sidebar-container {
  width: 220px;
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 모달 박스 */
.modal-content {
  background-color: rgb(255, 255, 255);
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 보기 버튼 스타일 */
.view-btn {
  background-color: #76abe0;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background-color: #eee;
  border: none;
  cursor: pointer;
}
/* 지원자 추가하기 버튼 */
.add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.add-btn:hover {
  background-color: #45a049;
}
</style>
