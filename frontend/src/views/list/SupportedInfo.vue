<script setup>
// DB 연결 완료 2월 25일
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
