<script setup>
import { ref, onMounted } from "vue";
// import { useRouter } from "vue-router";
import axios from "axios";

// const router = useRouter();

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
  <div class="container-fluid pt-4 pb-4 work-layout">
    <div class="work-container">
      <div class="left">
        <div
          class="filter-card card shadow-lg border-0 border-radius-xl overflow-hidden"
        >
          <div
            class="card-header p-3 bg-gradient-success shadow-success border-radius-lg d-flex align-items-center"
          >
            <i class="material-icons opacity-10 me-2">search</i>
            <span class="title text-white fw-bold">검색 필터</span>
          </div>
          <div class="card-body p-3">
            <div class="mb-4">
              <label class="form-label text-xs fw-bolder mb-1 text-secondary"
                >지원자 명</label
              >
              <input
                v-model="searchName"
                type="text"
                class="form-control form-control-sm"
                placeholder="이름 입력"
              />
            </div>
            <div class="mb-4">
              <label class="form-label text-xs fw-bolder mb-1 text-secondary"
                >성별</label
              >
              <div class="d-flex gap-1 flex-wrap">
                <button
                  v-for="g in ['전체', '남성', '여성']"
                  :key="g"
                  type="button"
                  class="btn btn-sm flex-grow-1"
                  :class="
                    searchGender === g
                      ? 'bg-gradient-success text-white'
                      : 'btn-outline-secondary'
                  "
                  @click="searchGender = g"
                >
                  {{ g }}
                </button>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label text-xs fw-bolder mb-1 text-secondary"
                >장애유형</label
              >
              <input
                v-model="searchDisability"
                type="text"
                class="form-control form-control-sm"
                placeholder="유형 입력"
              />
            </div>
            <div class="mb-4">
              <label class="form-label text-xs fw-bolder mb-1 text-secondary"
                >담당자</label
              >
              <input
                v-model="counsel_manager"
                type="text"
                class="form-control form-control-sm"
                placeholder="담당자명 입력"
              />
            </div>
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm flex-grow-1 bg-gradient-success text-white"
                @click="getList"
              >
                검색
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary flex-grow-1"
                @click="resetSearch"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="application-card card shadow-lg border-0 border-radius-xl">
          <div
            class="card-header p-3 bg-gradient-success shadow-success border-radius-lg d-flex justify-content-between align-items-center"
          >
            <div>
              <h6 class="mb-0 text-white font-weight-bolder">
                지원자 정보목록
              </h6>
              <span class="text-white text-xs opacity-8">
                총 {{ supported.length }}명
              </span>
            </div>
            <button
              type="button"
              class="btn btn-sm bg-gradient-dark text-white px-3"
              @click="openAddModal"
            >
              신규 등록
            </button>
          </div>

          <div class="card-body px-0 pb-2">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr class="bg-gray-100">
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      번호
                    </th>
                    <th
                      class="ps-4 text-secondary text-xxs font-weight-bolder opacity-7"
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
                  <tr v-for="member in supported" :key="member.sup_num">
                    <td class="text-center text-sm">{{ member.sup_num }}</td>
                    <td class="ps-4 text-sm font-weight-bold">
                      {{ member.sup_name }}
                    </td>
                    <td class="text-center text-sm">
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
                        type="button"
                        class="btn btn-sm bg-gradient-success text-white px-2"
                        @click="openDetailModal(member)"
                      >
                        보기
                      </button>
                    </td>
                    <td class="text-center text-sm">
                      <span v-if="member.user_id">{{ member.user_id }}</span>
                      <button
                        v-else
                        type="button"
                        class="btn btn-sm bg-gradient-warning text-white px-2"
                        @click="requestManager(member.sup_name)"
                      >
                        배정요청
                      </button>
                    </td>
                    <td class="text-center text-sm">
                      {{
                        member.sup_reg_date
                          ? member.sup_reg_date.split("T")[0]
                          : "-"
                      }}
                    </td>
                    <td class="text-center">
                      <button
                        type="button"
                        class="btn btn-sm bg-gradient-info text-white px-3"
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
      </div>
    </div>
  </div>

  <div v-if="detailModal" class="modal-overlay" @click.self="closeDetailModal">
    <div class="card modal-content shadow-lg p-4 border-radius-xl">
      <h5 class="font-weight-bolder text-success mb-3 fw-bold">
        장애유형 상세
      </h5>
      <div class="bg-gray-100 p-3 border-radius-lg mb-4 text-sm">
        지원자:
        <strong class="text-dark">{{ selectMember?.sup_name }}</strong>
        <table class="table mb-0 mt-2 align-items-center">
          <thead class="bg-gray-100">
            <tr class="text-xxs font-weight-bolder">
              <th class="text-center text-secondary text-xxs opacity-7">
                유형
              </th>
              <th class="text-center text-secondary text-xxs opacity-7">
                정도
              </th>
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
        type="button"
        class="btn btn-sm bg-gradient-dark w-100 text-white mb-0"
        @click="closeDetailModal"
      >
        창 닫기
      </button>
    </div>
  </div>

  <div
    v-if="isEditModalOpen && Modifymember"
    class="modal-overlay"
    @click.self="closeEditModal"
  >
    <div class="card modal-content shadow-lg p-4 border-radius-xl">
      <h5 class="font-weight-bolder text-dark mb-4 border-bottom pb-2 fw-bold">
        지원자 상세 정보 수정
      </h5>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >이름</label
        >
        <input
          v-model="Modifymember.sup_name"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-4">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >첨부파일명</label
        >
        <input
          v-model="sup_file"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-sm bg-gradient-success text-white flex-fill"
          @click="updateMember"
        >
          저장하기
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary flex-fill"
          @click="closeEditModal"
        >
          취소
        </button>
      </div>
    </div>
  </div>

  <div v-if="addModal" class="modal-overlay" @click.self="closeModal">
    <div class="card modal-content shadow-lg p-4 border-radius-xl">
      <h5
        class="font-weight-bolder text-success mb-4 border-bottom pb-2 fw-bold"
      >
        신규 지원자 등록
      </h5>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >지원자명</label
        >
        <input
          v-model="newSupported.sup_name"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-sm bg-gradient-success text-white flex-fill"
          @click="addSupported"
        >
          등록 완료
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary flex-fill"
          @click="closeModal"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* documentLIST.vue 동일 레이아웃 */
.work-layout {
  background-color: #f8f9fa;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.work-container {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

.left,
.right {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.left {
  max-width: 320px;
  flex: 0 0 auto;
}

.application-card,
.filter-card {
  background: #ffffff;
  padding: 18px 18px 20px;
  position: relative;
}

.filter-card .card-body {
  padding: 18px;
}

button {
  cursor: pointer;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  max-width: 550px;
  width: 90%;
  border-radius: 0.75rem;
}

.border-radius-xl {
  border-radius: 0.75rem;
}

.bg-gray-100 {
  background-color: #f8f9fa;
}
</style>
