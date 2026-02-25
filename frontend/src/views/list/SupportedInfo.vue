<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
// 지원자 명 검색
const searchName = ref("");
// 담당자 검색
const counsel_manager = ref("");

// 검색버튼 클릭 시 실행
const resetSearch = () => {
  searchName.value = "";
  counsel_manager.value = "";
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
// 담당자 배정 요청
const requestManager = (sup_name) => {
  alert(
    `${sup_name}님의 담당자 배정요청이 완료 되었습니다 요청 완료 시 안내 메일 발송`,
  );
  console.log(`${sup_name}님 배정 요청 처리됨`);
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
// 지원자 정보 수정 (나중에 추가해야 함)
// const modifyModal = ref(false)

// 지원자 정보 수정 모달창 관리

// 지원자 목록 데이터 부분
const supported = ref([]);

// 데이터 가져오기
// 함수 선언
const getList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/center/list");

    if (response.data.retCode === "OK") {
      // 실제 데이터 배열을 변수에 할당
      supported.value = response.data.result;
      console.log("데이터 가져오기 성공:", supported.value);
    }
  } catch (err) {
    console.error("오류! 서버가 꺼져 있거나 주소가 틀렸습니다:", err);
  }
};
// 함수 호출
onMounted(() => {
  getList();
});
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
            @click="router.push('/list/supported')"
          >
            - 지원자 현황
          </li>
          <li
            class="sub-item"
            :class="{ active: currentTab === 'info' }"
            @click="router.push('/list/info')"
          >
            - 지원자 정보관리
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
        <h2>지원자 정보목록</h2>
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
              <th>지원자 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in supported" :key="member.sup_num">
              <td>{{ member.sup_num }}</td>
              <td>{{ member.sup_name }}</td>
              <td>
                {{
                  member.sup_gender === "f1"
                    ? "남성"
                    : member.sup_gender === "f2"
                    ? "여성"
                    : "미정"
                }}
              </td>
              <td>{{ member.sup_birthday }}</td>
              <td>{{ member.sup_tel }}</td>
              <td>{{ member.sup_address }}</td>
              <td>
                <button class="view-btn" @click="openDetailModal(member)">
                  보기
                </button>
              </td>
              <td>
                <span v-if="member.manager">{{ member.manager }}</span>
                <button
                  v-else
                  class="assign-btn"
                  @click="requestManager(member.sup_name)"
                >
                  배정요청
                </button>
              </td>
              <td>{{ member.sup_reg_date.split("T")[0] }}</td>
              <td><button>수정하기</button></td>
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
      <p>
        <span>지원자명</span><strong>{{ selectMember?.sup_name }}</strong>
      </p>
      <p><span>등록한 장애유형</span></p>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>장애유형</th>
            <th>장애정도</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in selectMember?.disabilities" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.level }}</td>
          </tr>
        </tbody>
      </table>
      <button class="close-btn" @click="closeDetailModal">닫기</button>
    </div>
  </div>
  <!-- 지원자 추가 모달창 -->
  <div v-if="addModal" class="modal-overlay">
    <div class="modal-content">
      <h3>지원자 추가</h3>
      <div class="form-row">
        <p><span>지원자명</span><input type="text" v-model="sup_name" /></p>
      </div>
      <div class="form-row">
        <p><span>생년월일</span><input type="text" v-model="sup_birthday" /></p>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label>성별</label>
          <div class="radio-group">
            <label
              ><input type="radio" v-model="sup_gender" value="남성" />
              남성</label
            >
            <label
              ><input type="radio" v-model="sup_gender" value="여성" />
              여성</label
            >
          </div>
        </div>

        <div class="form-row">
          <label>휴대폰 번호</label>
          <input type="text" v-model="sup_tel" />
        </div>

        <div class="form-row">
          <label>주소</label>
          <input type="text" v-model="sup_address" placeholder="주소 입력" />
        </div>

        <div class="form-row">
          <label>장애유형</label>
          <input
            type="text"
            v-model="disability_category"
            placeholder="장애유형 입력"
          />
        </div>

        <div class="form-row">
          <label>첨부파일</label>
          <input
            type="text"
            v-model="sup_file"
            placeholder="파일은 pdf,jpg파일만 등록 가능"
          />
        </div>
      </div>
      <button class="close-btn" @click="closeAddModal">저장</button>
    </div>
  </div>
  <!-- 지원자 정보 수정 모달창 -->
  <div v-if="detailModal" class="modal-overlay">
    <div class="modal-content">
      <h3>지원자 정보수정</h3>
      <div>
        <p><span>이름</span><input type="text" v-model="sup_name" /></p>
        <p><span>생년월일</span><input type="text" v-model="sup_birthday" /></p>
        <p><span>휴대폰 번호</span><input type="text" v-model="sup_tel" /></p>
        <p><span>주소</span><input type="text" v-model="sup_address" /></p>
        <p>
          <span>장애유형 추가</span
          ><input
            type="text"
            v-model="disability_category"
            placeholder="장애유형을 추가"
          />
        </p>
        <p>
          <span>첨부파일</span
          ><input
            type="text"
            v-model="sup_file"
            placeholder="파일은 pdf,jpg파일만 등록 가능"
          />
        </p>
      </div>
    </div>
    <button class="close-btn" @click="closeAddModal">저장</button>
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
  min-width: 1000px;
  width: 100%;
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
  max-width: 90%;
  width: 500px;
  overflow-x: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
/* 2. 테이블이 부모 너비를 넘지 않게 설정 */
.modal-content table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 20px 0;
  word-break: break-all;
}

.modal-content th {
  background-color: #85b5e1; /* 이미지와 비슷한 파란색 계열 */
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
}

.modal-content td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  word-break: break-all; /* 내용이 길면 줄바꿈 처리 */
}

/* 보기 버튼 스타일 */
.view-btn {
  background-color: #a7d170;
  color: rgb(0, 0, 0);
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

/* 지원자 배정 요청 버튼 */
.assign-btn {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.assign-btn:hover {
  background-color: #e68a00;
}
</style>
