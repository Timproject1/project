<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const searchName = ref("");
const resetSearch = () => {
  searchName.value = "";
};
const centerList = ref([]);
const getCenterList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/center/list");

    if (response.data.retCode === "OK") {
      centerList.value = response.data.result;
      console.log("센터목록 가져오기 성공", centerList.value);
    }
  } catch (err) {
    console.log("센터목록 가져오기 실패:", err);
  }
};
onMounted(() => {
  getCenterList();
});

// 모달창에 입력 해야 하는 부분
const showAddModal = ref(false);
const newCenter = ref({
  repname: "",
  center_name: "",
  center_tel: "",
  center_addr: "",
  center_email: "",
  registernum: "",
  runed: "운영",
});

// 기관 등록 함수
const addCenter = async () => {
  if (Object.values(newCenter.value).some((val) => !val)) {
    alert("빠짐 없이 입력 해주세요");
    return;
  }
  try {
    const response = await axios.post(
      "http://localhost:3000/center/addCenter",
      newCenter.value,
    );
    if (response.data.retCode === "OK") {
      alert("기관 등록완료");
      showAddModal.value = false;

      newCenter.value = {
        repname: "",
        center_name: "",
        center_tel: "",
        center_addr: "",
        center_email: "",
        registernum: "",
        runed: "운영",
      };
      await getCenterList();
      console.log("기관 목록 등록완료");
    } else {
      console.log("서버 응답은 왔으나 OK가 아님:", response.data);
    }
  } catch (err) {
    console.error("기관 등록실패:", err);
    alert("기관 등록이 실패하였습니다");
  }
};
</script>
<template>
  <div class="main-container">
    <div class="layout-wrapper">
      <aside class="sidebar-container">
        <div class="management-box">
          <div class="box-header" @click="toggleMenu">
            기관관리 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
          </div>
          <ul>
            <li>기관담당자</li>
            <li>기관관리자</li>
            <li>기관목록</li>
          </ul>
        </div>

        <div class="search-box">
          <h3 class="search-title">기관 검색</h3>
          <div class="search-form">
            <div class="form-group">
              <label>기관명</label>
              <input type="text" v-model="searchName" />
            </div>
            <button class="search-btn" @click="resetSearch">검색</button>
          </div>
        </div>
      </aside>
    </div>
    <div class="table-wrapper">
      <h2>시스템관리자의 기관목록</h2>
      <button type="button" @click="showAddModal = true">기관 등록</button>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>대표명</th>
            <th>기관명</th>
            <th>대표번호</th>
            <th>주소</th>
            <th>이메일</th>
            <th>기관등록일</th>
            <th>운영상태</th>
            <th>정보수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="center in centerList" :key="center.registernum">
            <td>{{ center.registernum }}</td>
            <td>{{ center.repname }}</td>
            <td>{{ center.center_name }}</td>
            <td>{{ center.center_tel }}</td>
            <td>{{ center.center_addr }}</td>
            <td>{{ center.center_email }}</td>
            <td>{{ center.reg_date }}</td>
            <td>{{ center.runed }}</td>
            <td><button>수정하기</button></td>
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
      <!-- 기관 등록 -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h3>기관 등록</h3>
          <hr />
          <div class="form-group">
            <label>대표명</label>
            <input type="text" v-model="newCenter.repname" />
          </div>
          <div class="form-group">
            <label>기관명</label>
            <input type="text" v-model="newCenter.center_name" />
          </div>
          <div class="form-group">
            <label>대표번호</label>
            <input type="text" v-model="newCenter.center_tel" />
          </div>
          <div class="form-group">
            <label>주소</label>
            <input type="text" v-model="newCenter.center_addr" />
          </div>
          <div class="form-group">
            <label>이메일</label>
            <input type="text" v-model="newCenter.center_email" />
          </div>
          <div class="form-group">
            <label>기관 사업자 번호</label>
            <input type="text" v-model="newCenter.registernum" />
          </div>
          <div class="form-group">
            <label>기관 운영여부</label>
            <select v-model="newCenter.runed">
              <option value="운영">운영</option>
              <option value="휴업">휴업</option>
            </select>
          </div>
          <div class="modal-button">
            <button @click="addCenter">등록</button>
            <button @click="showAddModal = false">취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 부모 컨테이너를 가로 정렬로 만듭니다 */
.main-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* 사이드바 너비를 고정하고 밀리지 않게 설정 */
.sidebar-container {
  width: 250px;
  flex-shrink: 0;
  z-index: 10; /* 사이드바가 위로 올라오게 하되 영역을 명확히 함 */
}

/* 테이블 영역이 나머지 공간을 다 차지하게 설정 */
.table-wrapper {
  flex-grow: 1;
  padding: 20px;
  overflow-x: auto; /* 테이블이 길어질 때 가로 스크롤 허용 */
}
.layout-wrapper {
  display: flex; /* 사이드바와 콘텐츠를 가로로 나란히 */
  align-items: flex-start;
}
td {
  white-space: nowrap; /* 글자가 줄바꿈되지 않게 함 */
  overflow: hidden;
  text-overflow: ellipsis; /* 너무 길면 ...으로 표시 */
}
</style>
