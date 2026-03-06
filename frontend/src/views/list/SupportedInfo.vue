<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const isOpen = ref(true);
const currentTab = ref("info"); // 초기 활성화 탭: 지원자 정보관리

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// --- 1. 검색 필터 변수 (성별, 유형, 담당자 보강) ---
const searchName = ref("");
const searchGender = ref("전체");
const searchDisability = ref("");
const counsel_manager = ref("");

const resetSearch = () => {
  searchName.value = "";
  searchGender.value = "전체";
  searchDisability.value = "";
  counsel_manager.value = "";
};

// --- 2. 지원자 목록 데이터 로직 (원본 유지) ---
const supported = ref([]);
const getList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/support/list");
    if (response.data.retCode === "OK") {
      supported.value = response.data.result;
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};

onMounted(() => {
  getList();
});

// --- 3. 모달 제어 및 수정용 변수 ---
const detailModal = ref(false);
const selectMember = ref(null);
const isEditModalOpen = ref(false);
const Modifymember = ref(null);
const addModal = ref(false);
const sup_file = ref(""); // 파일 입력 변수

const newSupported = ref({
  sup_name: "",
  sup_birthday: "",
  sup_gender: "남성",
  sup_tel: "",
  sup_address: "",
  disability_category: "",
  sup_file: "",
});

// --- 4. [사용자 요청 로직 복구] 등록, 수정, 상세, 배정 함수 ---

const openAddModal = () => {
  addModal.value = true;
};

// 지원자 등록창 닫기
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

// 신규 등록 실행
const addSupported = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/support/add",
      newSupported.value,
    );
    if (response.data.retCode === "OK") {
      alert("등록 완료");
      closeModal();
      getList();
    }
  } catch (err) {
    console.error(err);
  }
};

// 정보 수정창 열기
const openEditModal = (member) => {
  Modifymember.value = { ...member };
  sup_file.value = member.sup_file || "";
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  Modifymember.value = null;
};

// 정보 수정 저장
const updateMember = async () => {
  try {
    Modifymember.value.sup_file = sup_file.value;
    const response = await axios.put(
      "http://localhost:3000/support/update",
      Modifymember.value,
    );
    if (response.status === 200) {
      alert("정보 수정 완료");
      isEditModalOpen.value = false;
      getList();
    }
  } catch (error) {
    alert("수정 실패");
  }
};

// 장애 유형 상세 보기
const openDetailModal = async (member) => {
  selectMember.value = member;
  try {
    const response = await axios.get(
      "http://localhost:3000/support/disabilities",
      { params: { sup_num: member.sup_num } },
    );
    selectMember.value.disabilities = response.data;
    detailModal.value = true;
  } catch (err) {
    console.error(err);
  }
};

// 상세창 닫기
const closeDetailModal = () => {
  detailModal.value = false;
  selectMember.value = null;
};

// 담당자 배정 요청
const requestManager = (name) =>
  alert(`${name}님의 담당자 배정요청이 완료되었습니다.`);
</script>

<template>
  <div class="container-fluid pt-6 pb-5 admin-layout">
    <div class="row wide-row">
      <aside class="col-lg-3 pe-lg-4">
        <div class="card sidebar-card shadow-sm mb-4 border-0">
          <div
            class="card-header bg-gradient-success p-3 cursor-pointer d-flex justify-content-between align-items-center"
            @click="toggleMenu"
          >
            <h6 class="text-white mb-0 font-weight-bolder">지원자 관리</h6>
            <span class="text-white text-xs">{{ isOpen ? "▼" : "▶" }}</span>
          </div>
          <div v-if="isOpen" class="card-body p-0">
            <ul class="menu-list">
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
                지원자 정보관리
              </li>
            </ul>
          </div>
        </div>

        <div class="card shadow-sm border-0 border-radius-lg overflow-hidden">
          <div class="card-header bg-gray-100 py-3 ps-3">
            <h6 class="mb-0 font-weight-bolder text-dark">검색 필터</h6>
          </div>
          <div class="card-body p-3">
            <div class="mb-3">
              <label class="text-xs fw-bold text-success">지원자 명</label>
              <input
                type="text"
                v-model="searchName"
                class="form-control border px-2 py-2"
                placeholder="이름 입력"
              />
            </div>
            <div class="mb-3">
              <label class="text-xs fw-bold text-success d-block">성별</label>
              <div class="btn-group w-100 shadow-none">
                <button
                  class="btn btn-sm btn-outline-success mb-0"
                  :class="{ active: searchGender === '전체' }"
                  @click="searchGender = '전체'"
                >
                  전체
                </button>
                <button
                  class="btn btn-sm btn-outline-success mb-0"
                  :class="{ active: searchGender === '남성' }"
                  @click="searchGender = '남성'"
                >
                  남성
                </button>
                <button
                  class="btn btn-sm btn-outline-success mb-0"
                  :class="{ active: searchGender === '여성' }"
                  @click="searchGender = '여성'"
                >
                  여성
                </button>
              </div>
            </div>
            <div class="mb-3">
              <label class="text-xs fw-bold text-success">장애유형</label>
              <input
                type="text"
                v-model="searchDisability"
                class="form-control border px-2 py-2"
                placeholder="유형 입력"
              />
            </div>
            <div class="mb-4">
              <label class="text-xs fw-bold text-success">담당자</label>
              <input
                type="text"
                v-model="counsel_manager"
                class="form-control border px-2 py-2"
                placeholder="담당자명 입력"
              />
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn bg-gradient-dark w-100 text-white fw-bold mb-0"
                @click="getList"
              >
                검색
              </button>
              <button
                class="btn btn-outline-secondary w-100 mb-0 px-2"
                @click="resetSearch"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main class="col-lg-9">
        <div class="card shadow-lg border-0 main-content-card">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
              class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 ps-4 pe-4 d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 class="text-white mb-0 font-weight-bolder">
                  지원자 정보목록
                </h5>
                <p class="text-white text-xs opacity-9 mb-0">
                  총 {{ supported.length }}명의 데이터를 관리 중입니다.
                </p>
              </div>
              <button
                class="btn btn-white btn-sm mb-0 text-success fw-bold px-4"
                @click="openAddModal"
              >
                신규 등록
              </button>
            </div>
          </div>

          <div class="card-body px-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0 w-100">
                <thead>
                  <tr class="bg-gray-100">
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7 py-3"
                    >
                      번호
                    </th>
                    <th
                      class="ps-3 text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      지원자명
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      성별
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      장애유형
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      담당자명
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      지원자 등록일
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in supported"
                    :key="member.sup_num"
                    class="table-hover-row"
                  >
                    <td class="text-center text-xs font-weight-bold">
                      {{ member.sup_num }}
                    </td>
                    <td class="ps-3 text-sm font-weight-bold text-dark">
                      {{ member.sup_name }}
                    </td>
                    <td class="text-center text-xs">
                      <span
                        class="badge badge-sm"
                        :class="
                          member.gender === 'm1' || member.gender === '남성'
                            ? 'bg-gradient-info'
                            : 'bg-gradient-danger'
                        "
                      >
                        {{
                          member.gender === "m1" || member.gender === "남성"
                            ? "남성"
                            : "여성"
                        }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-xs btn-outline-success mb-0 fw-bold"
                        @click="openDetailModal(member)"
                      >
                        보기
                      </button>
                    </td>
                    <td class="text-center">
                      <span
                        v-if="member.user_id"
                        class="text-xs font-weight-bold text-dark"
                        >{{ member.user_id }}</span
                      >
                      <button
                        v-else
                        class="btn btn-xs bg-gradient-warning mb-0 text-white"
                        @click="requestManager(member.sup_name)"
                      >
                        배정요청
                      </button>
                    </td>
                    <td
                      class="text-center text-xs font-weight-bold text-secondary"
                    >
                      {{
                        member.sup_reg_date
                          ? member.sup_reg_date.split("T")[0]
                          : "-"
                      }}
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm bg-gradient-info mb-0 px-3 py-1 fw-bold text-white shadow-sm"
                        @click="openEditModal(member)"
                      >
                        정보수정
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="detailModal" class="modal-overlay">
      <div class="card modal-content border-radius-xl shadow-xl p-4">
        <h5 class="font-weight-bolder text-success mb-3">장애유형 상세</h5>
        <div class="bg-gray-100 p-3 border-radius-lg mb-4 text-sm">
          지원자:
          <strong class="text-dark">{{ selectMember?.sup_name }}</strong>
          <table class="table mb-0 mt-2">
            <thead>
              <tr class="text-xxs font-weight-bolder">
                <th>유형</th>
                <th>정도</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in selectMember?.disabilities" :key="idx">
                <td class="text-xs">{{ item.type }}</td>
                <td class="text-xs">{{ item.level }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          class="btn bg-gradient-dark w-100 mb-0"
          @click="closeDetailModal"
        >
          창 닫기
        </button>
      </div>
    </div>

    <div v-if="isEditModalOpen && Modifymember" class="modal-overlay">
      <div class="card modal-content border-radius-xl shadow-xl p-4">
        <h5 class="font-weight-bolder text-dark mb-4 border-bottom pb-2">
          지원자 상세 정보 수정
        </h5>
        <div class="mb-3">
          <label class="text-xs fw-bold text-success">이름</label
          ><input
            type="text"
            v-model="Modifymember.sup_name"
            class="form-control border p-2"
          />
        </div>
        <div class="mb-4">
          <label class="text-xs fw-bold text-success">첨부파일명</label
          ><input
            type="text"
            v-model="sup_file"
            class="form-control border p-2"
          />
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn bg-gradient-success w-100 mb-0 fw-bold"
            @click="updateMember"
          >
            저장하기
          </button>
          <button
            class="btn btn-outline-secondary w-100 mb-0"
            @click="closeEditModal"
          >
            취소
          </button>
        </div>
      </div>
    </div>

    <div v-if="addModal" class="modal-overlay">
      <div class="card modal-content border-radius-xl shadow-xl p-4">
        <h5 class="font-weight-bolder text-success mb-4 border-bottom pb-2">
          신규 지원자 등록
        </h5>
        <div class="mb-3">
          <label class="text-xs fw-bold text-success">지원자명</label
          ><input
            type="text"
            v-model="newSupported.sup_name"
            class="form-control border p-2"
          />
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn bg-gradient-success w-100 mb-0 fw-bold"
            @click="addSupported"
          >
            등록 완료
          </button>
          <button
            class="btn btn-outline-secondary w-100 mb-0"
            @click="closeModal"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. 레이아웃 및 카드 확장: 삐져나옴 방지 */
.admin-layout {
  background-color: #f8f9fa;
  min-height: 100vh !important;
  display: block !important;
}
.wide-row {
  max-width: 1600px;
  margin: 0 auto;
}

.sidebar-card {
  overflow: hidden !important;
  border-radius: 12px !important;
  border: none !important;
}

.main-content-card {
  height: auto !important;
  min-height: 750px;
  background-color: #ffffff !important;
  overflow: visible !important;
  border: none;
}

/* 2. 사이드바 호버 & 액티브 (image_ea6b89.png 스타일 반영) */
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
  transition: all 0.2s ease;
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
  background-color: #4caf50;
  transition: opacity 0.2s ease;
}

/* 마우스 호버 시 기존 바 숨김 */
.menu-list:hover li.active::before {
  opacity: 0;
}
.menu-list li.active:hover::before {
  opacity: 1;
}

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
.modal-content {
  max-width: 550px;
  width: 90%;
  animation: slideUp 0.3s ease-out;
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
