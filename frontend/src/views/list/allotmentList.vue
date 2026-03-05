<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const isOpen = ref(false);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const Notsupported = ref([]);
const showModal = ref(false);
const managerList = ref([
  { user_id: "m1", user_name: "김철수", count: 5, status: "근무중" },
  { user_id: "m2", user_name: "이영희", count: 2, status: "근무중" },
  { user_id: "m3", user_name: "박지성", count: 0, status: "휴가" },
]);

const getNomanagerList = async () => {
  try {
    const responese = await axios.get("http://localhost:3000/support/list");
    if (responese.data.retCode === "OK") {
      // const filters = responese.data.result.filter(
      //   (item) =>
      //     (item.sup_approved === "d1" || item.sup_approved === "d2") &&
      //     (item.user_id === null || item.user_id === ""),
      // );
      // console.log("필터링 완료:", filters);
      // Notsupported.value = filters.map((item) => ({
      //   ...item,
      //   display_status: "미배정",
      // }));
      const allData = responese.data.result;
      Notsupported.value = allData.map((item) => ({
        ...item,
        display_status: item.user_id ? "d1" : "d2",
      }));
    }
  } catch (err) {
    console.error("데이터 불러오기 실패", err);
  }
};
onMounted(() => {
  getNomanagerList();
});

// 검색창 부분

// 지원자 명 검색
const searchName = ref("");
const resetSearch = () => {
  searchName.value = "";
};

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
  <table>
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
        <td>{{ member.sup_reg_date?.split("T")[0] }}</td>
        <td>{{ member.display_status }}</td>
        <td><button @click="showModal = true">배정하기</button></td>
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
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>담당자 목록</h3>
      <table>
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
          <tr v-for="(manager, index) in managerList" :key="manager.user_id">
            <td>{{ index + 1 }}</td>
            <td>{{ manager.user_name }}</td>
            <td>{{ manager.count }}명</td>
            <td>{{ manager.status }}</td>
            <td><button @click="showModal = false">지정</button></td>
          </tr>
        </tbody>
      </table>
      <button class="close-btn" @click="showModal = false">닫기</button>
    </div>
  </div>
</template>
