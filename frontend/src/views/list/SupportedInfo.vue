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
  getList();
};

const supported = ref([]);
// --- 2. 지원자 목록 데이터 로직 ---
// --- 수정된 getList 함수 ---
const getList = async () => {
  try {
    // 검색 필터의 값들이 searchParams 객체에 정확히 담기도록 합니다.
    const searchParams = {
      name: searchName.value,
      gender: searchGender.value,
      disability: searchDisability.value,
      manager: counsel_manager.value,
    };

    // 서버에 파라미터를 함께 전송합니다.
    const response = await axios.get("http://localhost:3000/support/list", {
      params: searchParams,
    });

    // 서버 응답이 OK일 때만 데이터를 업데이트합니다.
    if (response.data && response.data.retCode === "OK") {
      supported.value = response.data.result;
      console.log("데이터 갱신 완료:", supported.value);
    } else {
      console.log("데이터 조회 실패 또는 결과 없음");
    }
  } catch (err) {
    console.error("검색 실패:", err);
  }
};
onMounted(() => {
  getList();
});

// --- 3. 모달 제어 및 수정용 변수 ---
const detailModel = ref(false);
const selectMember = ref(null);
const isEditModelOpen = ref(false);
const Modifymember = ref(null);
const addModel = ref(false);
const sup_file = ref(""); // 파일 입력 변수

const newSupported = ref({
  sup_name: "",
  sup_birthday: "",
  gender: "남성",
  sup_tel: "",
  sup_address: "",
  disability_category: "",
  sup_file: "",
});

// --- 4. [사용자 요청 로직 복구] 등록, 수정, 상세, 배정 함수 ---

const openAddModel = () => {
  addModel.value = true;
};

// 지원자 등록창 닫기
const closeModel = () => {
  addModel.value = false;
  newSupported.value = {
    sup_name: "",
    sup_birthday: "",
    gender: "남성",
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
      closeModel();
      getList();
    }
  } catch (err) {
    console.error(err);
  }
};

// 정보 수정창 열기
const openEditModel = (member) => {
  Modifymember.value = { ...member };
  sup_file.value = member.sup_file || "";
  isEditModelOpen.value = true;
};

const closeEditModel = () => {
  isEditModelOpen.value = false;
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
      isEditModelOpen.value = false;
      getList();
    }
  } catch (error) {
    alert("수정 실패");
  }
};

// 장애 유형 상세 보기
const openDetailModel = async (member) => {
  selectMember.value = member;
  try {
    const response = await axios.get(
      "http://localhost:3000/support/disabilities",
      { params: { sup_num: member.sup_num } },
    );
    selectMember.value.disabilities = response.data;
    detailModel.value = true;
  } catch (err) {
    console.error(err);
  }
};

// 상세창 닫기
const closeDetailModel = () => {
  detailModel.value = false;
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
              @click="openAddModel"
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
                        @click="openDetailModel(member)"
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
                        @click="openEditModel(member)"
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

  <div v-if="detailModel" class="model-overlay" @click.self="closeDetailModel">
    <div class="card model-content shadow-lg p-4 border-radius-xl">
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
        @click="closeDetailModel"
      >
        창 닫기
      </button>
    </div>
  </div>

  <div
    v-if="isEditModelOpen && Modifymember"
    class="model-overlay"
    @click.self="closeEditModel"
  >
    <div class="card model-content shadow-lg p-4 border-radius-xl">
      <h5 class="font-weight-bolder text-dark mb-4 border-bottom pb-2 fw-bold">
        지원자 상세 정보 수정
      </h5>
      <div class="mb-1">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >이름</label
        >
        <input
          v-model="Modifymember.sup_name"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-1">
        <label for="form-label text-xs fw-bolder mb-1 text-secondary">
          생년월일
        </label>
        <input
          v-model="Modifymember.sup_birthday"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-1">
        <label for="form-label text-xs fw-bolder mb-1 text-secondary">
          휴대폰번호
        </label>
        <input
          v-model="Modifymember.sup_tel"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-1">
        <label for="form-label text-xs fw-bolder mb-1 text-secondary">
          주소
        </label>
        <input
          v-model="Modifymember.sup_address"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-1">
        <label for="form-label text-xs fw-bolder mb-1 text-secondary">
          장애유형 수정
        </label>
        <input
          v-model="Modifymember.disability_category"
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
          @click="closeEditModel"
        >
          취소
        </button>
      </div>
    </div>
  </div>

  <div v-if="addModel" class="model-overlay" @click.self="closeModel">
    <div class="card model-content shadow-lg p-4 border-radius-xl">
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
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >생년월일</label
        >
        <input
          v-model="newSupported.sup_birthday"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >성별</label
        >
        <input
          v-model="newSupported.gender"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >휴대폰번호</label
        >
        <input
          v-model="newSupported.sup_tel"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >주소</label
        >
        <input
          v-model="newSupported.sup_address"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >장애유형</label
        >
        <input
          v-model="newSupported.disability_category"
          type="text"
          class="form-control form-control-sm"
        />
      </div>
      <div class="mb-3">
        <label class="form-label text-xs fw-bolder mb-1 text-secondary"
          >첨부파일</label
        >
        <input
          v-model="newSupported.sup_file"
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
          @click="closeModel"
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
  background-color: var(--app-surface-muted);
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
  background: var(--app-surface);
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
.model-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  z-index: 9999;
}

/* 모달 내용물 */
.model-content {
  background: white;
  padding: 30px;
  border-radius: 1rem;
  width: 90%; /* 화면이 작을 땐 90% */
  max-width: 500px; /* 하지만 500px을 넘지 않게 고정 */
  max-height: 85vh; /* 화면 높이의 85%까지만 차지 */
  overflow-y: auto; /* 내용이 많으면 내부에서만 스크롤 */
  box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05); /* 부드러운 그림자 */
}

.border-radius-xl {
  border-radius: 0.75rem;
}

.bg-gray-100 {
  background-color: #f8f9fa;
}
.model-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
}
</style>
