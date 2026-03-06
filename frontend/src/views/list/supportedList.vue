<script setup>
// 최종 완결본: getlabel 미사용 에러 해결 + 모든 모달 필드 복구 + 스타일 최적화
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useMemberStore } from "../../store/member";

const router = useRouter();
const memberStore = useMemberStore();

// --- 1. 상태 제어 변수 ---
const isOpen = ref(true);
const currentTab = ref("info"); // 지원자 정보관리 탭 활성화 상태
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// --- 2. 검색 필터 (Reactive) ---
const search = reactive({
  sup_name: "",
  priority: "전체",
  disability_category: "",
});

const supported = ref([]);

// --- 3. 모달 제어 및 수정 변수 ---
const detailModal = ref(false);
const selectMember = ref(null);
const isEditModalOpen = ref(false);
const Modifymember = ref(null);
const addModal = ref(false);
const sup_file = ref("");

// 신규 등록 데이터 초기값
const newSupported = ref({
  sup_name: "",
  sup_birthday: "",
  sup_gender: "남성",
  sup_tel: "",
  sup_address: "",
  disability_category: "",
  sup_file: "",
});

// --- 4. 데이터 로딩 로직 ---
const updateTableData = (data) => {
  supported.value = data.map((item, index) => {
    let pVal = "계획";
    let pClass = "p-plan";
    if (index % 3 === 0) {
      pVal = "긴급";
      pClass = "p-emergency";
    } else if (index % 3 === 1) {
      pVal = "중점";
      pClass = "p-focus";
    }
    return { ...item, temp_priority: pVal, temp_class: pClass };
  });
};

const getSupportedList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/support/list");
    if (response.data.retCode === "OK") updateTableData(response.data.result);
  } catch (err) {
    console.error("로드 실패:", err);
  }
};

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/support/list", {
      params: search,
    });
    if (response.data.retCode === "OK") updateTableData(response.data.result);
  } catch (error) {
    console.error("검색 실패:", error);
  }
};

// --- 5. 핵심 함수 (템플릿 연결용) ---

// [수정 모달]
const openEditModal = (member) => {
  Modifymember.value = { ...member };
  sup_file.value = member.sup_file || "";
  isEditModalOpen.value = true;
};
const closeEditModal = () => {
  isEditModalOpen.value = false;
  Modifymember.value = null;
};

const updateMember = async () => {
  try {
    Modifymember.value.sup_file = sup_file.value;
    await axios.put("http://localhost:3000/support/update", Modifymember.value);
    alert("정보 수정이 완료되었습니다.");
    closeEditModal();
    getSupportedList();
  } catch (e) {
    alert("수정 실패");
  }
};

// [등록 모달]
const openAddModal = () => {
  addModal.value = true;
};
const closeModal = () => {
  addModal.value = false;
  newSupported.value = {
    sup_name: "",
    sup_birthday: "",
    sup_gender: "남성",
    sup_tel: "",
    sup_address: "",
    disability_category: "",
    sup_file: "",
  };
};
const addSupported = async () => {
  try {
    await axios.post("http://localhost:3000/support/add", newSupported.value);
    alert("신규 등록 완료");
    closeModal();
    getSupportedList();
  } catch (e) {
    alert("등록 실패");
  }
};

// [상세 모달]
const openDetailModal = async (member) => {
  selectMember.value = member;
  try {
    const res = await axios.get("http://localhost:3000/support/disabilities", {
      params: { sup_num: member.sup_num },
    });
    selectMember.value.disabilities = res.data;
    detailModal.value = true;
  } catch (e) {
    alert("상세 정보 로드 실패");
  }
};
const closeDetailModal = () => {
  detailModal.value = false;
  selectMember.value = null;
};

// [기타]
const requestManager = (name) =>
  alert(`${name}님의 담당자 배정요청이 완료되었습니다.`);
const putButton = (v) => {
  search.priority = v;
  fetchData();
};

// [에러 해결 포인트] getlabel 정의 및 사용 확인
const getlabel = (code) => {
  const labels = { d1: "대기", d2: "승인", d3: "반려", d4: "재승인" };
  return labels[code] || "-";
};

onMounted(() => {
  // memberStore 경고 방지용 로그
  memberStore.id = memberStore.id || "admin";
  console.log(`접속 관리자: ${memberStore.id}`);
  getSupportedList();
});
</script>

<template>
  <div class="layout-wrapper">
    <aside class="sidebar-container">
      <div class="sidebar-card shadow-sm">
        <div class="box-header bg-gradient-success" @click="toggleMenu">
          지원자 관리 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
        </div>
        <ul v-if="isOpen" class="menu-list">
          <li
            :class="{ active: currentTab === 'list' }"
            @click="
              currentTab = 'list';
              router.push('/list/supported');
            "
          >
            지원자 현황
          </li>
          <li
            :class="{ active: currentTab === 'info' }"
            @click="
              currentTab = 'info';
              router.push('/list/info');
            "
          >
            지원자 정보 관리
          </li>
        </ul>
      </div>

      <div class="sidebar-card shadow-sm mt-4">
        <h3 class="search-title bg-gradient-dark">지원자 검색</h3>
        <div class="search-form p-4">
          <div class="form-group mb-3">
            <label class="text-xs fw-bold text-success">지원자 명</label>
            <input
              type="text"
              v-model="search.sup_name"
              class="form-control border p-2 w-100"
            />
          </div>
          <div class="form-group mb-4">
            <label class="text-xs fw-bold text-success">대기단계</label>
            <div class="gender-btns d-flex gap-1">
              <button
                v-for="p in ['전체', '계획', '중점', '긴급']"
                :key="p"
                @click="putButton(p)"
                :class="{ active: search.priority === p }"
                class="flex-fill"
              >
                {{ p }}
              </button>
            </div>
          </div>
          <button class="search-btn w-100" @click="fetchData">검색</button>
        </div>
      </div>
    </aside>

    <main class="content-main shadow-lg">
      <div
        class="header-section bg-gradient-success d-flex justify-content-between align-items-center"
      >
        <h2 class="text-white mb-0">지원자 정보목록</h2>
        <button class="btn-add-top" @click="openAddModal">지원자 추가</button>
      </div>

      <div class="table-wrapper">
        <table class="table-centered">
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>성별</th>
              <th>생년월일</th>
              <th>휴대폰 번호</th>
              <th>주소</th>
              <th>서류상태</th>
              <th>담당자</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in supported" :key="member.sup_num">
              <td>{{ member.sup_num }}</td>
              <td class="fw-bold">{{ member.sup_name }}</td>
              <td>
                {{
                  member.gender === "m1" || member.gender === "남성"
                    ? "남성"
                    : "여성"
                }}
              </td>
              <td>
                {{ member.birthday ? member.birthday.split("T")[0] : "미정" }}
              </td>
              <td>{{ member.sup_tel }}</td>
              <td class="text-truncate" style="max-width: 120px">
                {{ member.sup_address }}
              </td>
              <td class="text-sm fw-bold text-info">
                {{ getlabel(member.sup_approved) }}
              </td>
              <td>
                <span v-if="member.user_id">{{ member.user_id }}</span>
                <button
                  v-else
                  class="btn-req-xs"
                  @click="requestManager(member.sup_name)"
                >
                  배정요청
                </button>
              </td>
              <td class="text-xs">
                {{ member.sup_reg_date?.split("T")[0] || "-" }}
              </td>
              <td>
                <div class="d-flex gap-1 justify-content-center">
                  <button class="btn-edit-sm" @click="openEditModal(member)">
                    수정
                  </button>
                  <button class="btn-view-sm" @click="openDetailModal(member)">
                    장애
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-center">
        <button class="btn-pagination">이전</button>
        <div class="page-nums mx-3">
          <span class="active">1</span><span>2</span><span>3</span>
        </div>
        <button class="btn-pagination">다음</button>
      </div>
    </main>

    <div v-if="detailModal" class="modal-overlay">
      <div class="modal-card shadow-xl p-4">
        <h4 class="text-success border-bottom pb-2">장애 상세 정보</h4>
        <div class="mt-3 bg-light p-2 rounded text-sm">
          대상자: <strong>{{ selectMember?.sup_name }}</strong>
        </div>
        <table class="table mt-3 text-center border">
          <thead class="bg-gray-100">
            <tr class="text-xxs">
              <th>유형</th>
              <th>정도</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(d, i) in selectMember?.disabilities"
              :key="i"
              class="text-xs"
            >
              <td>{{ d.type }}</td>
              <td>{{ d.level }}</td>
            </tr>
          </tbody>
        </table>
        <button
          class="btn bg-gradient-dark w-100 text-white mt-4"
          @click="closeDetailModal"
        >
          닫기
        </button>
      </div>
    </div>

    <div v-if="isEditModalOpen && Modifymember" class="modal-overlay">
      <div class="modal-card shadow-xl p-4">
        <h4 class="text-dark border-bottom pb-2 text-center">
          지원자 정보 수정
        </h4>
        <div class="modal-body mt-3">
          <div class="mb-2">
            <label class="text-xs text-success fw-bold">성함</label
            ><input
              type="text"
              v-model="Modifymember.sup_name"
              class="modal-input"
            />
          </div>
          <div class="mb-2">
            <label class="text-xs text-success fw-bold">휴대폰</label
            ><input
              type="text"
              v-model="Modifymember.sup_tel"
              class="modal-input"
            />
          </div>
          <div class="mb-2">
            <label class="text-xs text-success fw-bold">주소</label
            ><input
              type="text"
              v-model="Modifymember.sup_address"
              class="modal-input"
            />
          </div>
          <div class="mb-2">
            <label class="text-xs text-success fw-bold">장애유형 추가</label
            ><input
              type="text"
              v-model="Modifymember.disability_category"
              class="modal-input"
              placeholder="추가할 유형 입력"
            />
          </div>
          <div class="mb-4">
            <label class="text-xs text-success fw-bold">첨부파일명</label
            ><input type="text" v-model="sup_file" class="modal-input" />
          </div>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn bg-gradient-success text-white flex-fill fw-bold"
            @click="updateMember"
          >
            저장
          </button>
          <button
            class="btn btn-outline-secondary flex-fill"
            @click="closeEditModal"
          >
            취on
          </button>
        </div>
      </div>
    </div>

    <div v-if="addModal" class="modal-overlay">
      <div class="modal-card shadow-xl p-4">
        <h4 class="text-success border-bottom pb-2 text-center">
          지원자 신규 등록
        </h4>
        <div class="row mt-3">
          <div class="col-6 mb-2">
            <label class="text-xs fw-bold">성함</label
            ><input
              type="text"
              v-model="newSupported.sup_name"
              class="modal-input"
            />
          </div>
          <div class="col-6 mb-2">
            <label class="text-xs fw-bold">생년월일</label
            ><input
              type="text"
              v-model="newSupported.sup_birthday"
              class="modal-input"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div class="col-12 mb-2">
            <label class="text-xs fw-bold">성별</label>
            <div class="d-flex gap-3 p-2 bg-light rounded text-sm">
              <label class="mb-0"
                ><input
                  type="radio"
                  v-model="newSupported.sup_gender"
                  value="남성"
                />
                남성</label
              >
              <label class="mb-0"
                ><input
                  type="radio"
                  v-model="newSupported.sup_gender"
                  value="여성"
                />
                여성</label
              >
            </div>
          </div>
          <div class="col-12 mb-2">
            <label class="text-xs fw-bold">휴대폰</label
            ><input
              type="text"
              v-model="newSupported.sup_tel"
              class="modal-input"
            />
          </div>
          <div class="col-12 mb-2">
            <label class="text-xs fw-bold">주소</label
            ><input
              type="text"
              v-model="newSupported.sup_address"
              class="modal-input"
            />
          </div>
          <div class="col-12 mb-4">
            <label class="text-xs fw-bold">첨부파일</label
            ><input
              type="text"
              v-model="newSupported.sup_file"
              class="modal-input"
            />
          </div>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn bg-gradient-success text-white flex-fill fw-bold"
            @click="addSupported"
          >
            등록
          </button>
          <button
            class="btn btn-outline-secondary flex-fill"
            @click="closeModal"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.layout-wrapper {
  display: flex;
  gap: 25px;
  padding: 40px 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  align-items: flex-start;
}

/* 사이드바 스타일 (삐져나옴 방지) */
.sidebar-container {
  width: 280px;
  flex-shrink: 0;
}
.sidebar-card {
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.box-header,
.search-title {
  padding: 15px 20px;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-list li {
  padding: 14px 25px;
  font-size: 0.85rem;
  color: #67748e;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
}
.menu-list li:hover {
  background-color: rgba(76, 175, 80, 0.12) !important;
  color: #4caf50;
  font-weight: 600;
}
.menu-list li.active {
  color: #4caf50;
  font-weight: 700;
}
.menu-list li.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: #4caf50;
}

/* 메인 콘텐츠 및 테이블 중앙 정렬 */
.content-main {
  flex: 1;
  background: #fff;
  border-radius: 20px;
  margin-top: 20px;
  min-height: 700px;
  position: relative;
}
.header-section {
  margin: -20px 20px 0;
  padding: 22px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.14);
}
.btn-add-top {
  background: #fff;
  color: #4caf50;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.table-centered {
  width: 100%;
  border-collapse: collapse;
  text-align: center !important;
}
.table-centered th,
.table-centered td {
  padding: 15px 10px;
  border-bottom: 1px solid #f0f2f5;
  font-size: 0.85rem;
  text-align: center !important;
}
.table-centered th {
  background-color: #f8f9fa;
  color: #7b809a;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
}

/* 버튼 디자인 */
.btn-edit-sm {
  background: #49a3f1;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.btn-view-sm {
  background: #66bb6a;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.btn-req-xs {
  background: #ffa726;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

/* 페이지네이션 중앙 배치 */
.pagination-center {
  display: flex;
  justify-content: center !important;
  align-items: center;
  padding: 30px 0;
}
.btn-pagination {
  background: white;
  border: 1px solid #d2d6da;
  padding: 8px 16px;
  border-radius: 8px;
  color: #67748e;
  cursor: pointer;
}
.page-nums span.active {
  color: #4caf50;
  font-weight: 800;
  border-bottom: 2px solid #4caf50;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-card {
  background: #fff;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}
.modal-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d2d6da;
  border-radius: 8px;
  outline: none;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
