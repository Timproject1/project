<script setup>
import { ref } from "vue";
const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const centerList = ref([
  {
    center_num: 1,
    repname: "김철수",
    center_name: "대구 00기관",
    center_tel: "053-123-4567",
    center_addr: "대구광역시 00구 00동 00빌라 3층",
    center_email: "asd456@email.com",
    reg_date: "26.02.03",
    runed: "운영중",
  },
  {
    center_num: 2,
    repname: "이영희",
    center_name: "부산 00기관",
    center_tel: "051-456-7891",
    center_addr: "부산광역시 00구 00동 00빌딩 3층",
    center_email: "qwer789@email.com",
    reg_date: "25.12.10",
    runed: "운영중",
  },
  {
    center_num: 3,
    repname: "정00",
    center_name: "00기관",
    center_tel: "02-456-7894",
    center_addr: "00광역시 00구 00동 00빌딩",
    center_email: "qaz123@email.com",
    reg_date: "25.11.20",
    runed: "운영중",
  },
  {
    center_num: 4,
    repname: "박00",
    center_name: "00기관",
    center_tel: "02-963-8521",
    center_addr: "00광역시 00구 00동 00빌딩",
    center_email: "qaz123@email.com",
    reg_date: "25.10.20",
    runed: "운영중",
  },
  {
    center_num: 5,
    repname: "최00",
    center_name: "00기관",
    center_tel: "",
    center_addr: "00광역시 00구 00동 00빌딩",
    center_email: "qaz123@email.com",
    reg_date: "24.10.20",
    runed: "운영중",
  },
]);

// 모달창에 입력 해야 하는 부분
const showAddModal = ref(false);
const newCenter = ref({
  repname: "",
  center_name: "",
  center_tel: "",
  center_addr: "",
  center_email: "",
  registernum: "",
  runed: "",
});

// 기관 등록 함수
const addCenter = () => {
  if (
    !newCenter.value.repname ||
    !newCenter.value.center_name ||
    !newCenter.value.center_tel ||
    !newCenter.value.center_addr ||
    !newCenter.value.center_email ||
    !newCenter.value.registernum ||
    !newCenter.value.runed
  ) {
    alert("빠짐 없이 입력 해주세요");
    return;
  }
  const nextNum =
    centerList.value.length > 0
      ? Math.max(...centerList.value.map((C) => Number(C.center_num))) + 1
      : 1;
  centerList.value.push({
    center_num: nextNum,
    center_name: "",
    center_tel: "",
    center_addr: "",
    center_email: "",
    registernum: "",
    runed: "",
  });
  alert("등록 완료");

  newCenter.value = {
    repname: "",
    center_name: "",
    center_tel: "",
    center_addr: "",
    center_email: "",
    registernum: "",
    runed: "",
  };
  showAddModal.value = false;
};
</script>
<template>
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
        <tr v-for="center in centerList" :key="center.center_num">
          <td>{{ center.center_num }}</td>
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
      <div class="modal-contnet">
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
            <option value="폐업">폐업</option>
          </select>
        </div>
        <div class="modal-button">
          <button @click="addCenter">등록</button>
          <button @click="showAddModal = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
