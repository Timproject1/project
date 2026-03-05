<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import axios from "axios";

const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const searchName = ref("");
// 지원자 목록에 들어갈 정보
const supported = ref([]);

const getList = async () => {
  try {
    const loginId = "user";
    const response = await axios.get("http://localhost:3000/support/list", {
      params: {
        user_id: loginId,
        sup_name: searchName.value, // 사용자가 입력한 검색어 추가!
      },
    });

    if (response.data.retCode === "OK") {
      supported.value = response.data.result;
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};

// 검색 버튼 클릭 시 실행할 함수
const handleSearch = () => {
  getList(); // 현재 입력된 searchName으로 다시 조회합니다.
};

// 3. 페이지가 로드될 때 실행
onMounted(() => {
  getList();
});
const resetSearch = () => {
  searchName.value = "";
  // 검색 결과 초기화 로직 (전체 목록 다시 불러오기)
  getList();
};
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
            <button>남성</button>
            <button>여성</button>
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
          <button class="search-btn" @click="handleSearch">검색</button>
          <button class="reset-btn" @click="resetSearch">초기화</button>
        </div>
      </div>
    </aside>
  </div>
  <h2>지원자 목록(자기에게 배정받은)</h2>
  <table>
    <thead>
      <tr>
        <td>번호</td>
        <td>지원자 명</td>
        <td>대기단계</td>
        <td>지원신청일</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="member in supported" :key="member.sup_num">
        <td>{{ member.sup_num }}</td>
        <td>{{ member.sup_name }}</td>
        <td>{{ member.progress || "d2" }}</td>
        <td>
          {{ member.sup_reg_date ? member.sup_reg_date.split("T")[0] : "-" }}
        </td>
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
