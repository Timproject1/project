<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const supported = ref([]);
const getSupportedList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/center/list");

    if (response.data.retCode === "OK") {
      supported.value = response.data.result;
      console.log("데이터 가져오기 성공", supported.value);
    }
  } catch (err) {
    console.log("데이터 가져오기 오류:", err);
  }
};
onMounted(() => {
  getSupportedList();
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
            - 지원자 정보 관리
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
            <label>대기단계</label>
            <div class="gender-btns">
              <button class="active">전체</button>
              <button>계획</button>
              <button>중점</button>
              <button>긴급</button>
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
        <h2>지원자 현황목록</h2>
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
              <td>{{ member.priority || "데이터 없음" }}</td>
              <td>{{ member.sup_reg_date }}</td>
              <td>{{ member.progress || "대기중" }}</td>
              <td>{{ member.sup_reg_date }}</td>
              <td>{{ member.plan_manager || "홍길동" }}</td>
              <td><button>보기</button></td>
              <td><button>보기</button></td>
              <td><button>보기</button></td>
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
