<script setup>
// 최종 완료
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
const sup_file = ref(null);

// 지원자 정보 수정 부분
const Modifymember = ref(null);
const isEditModalOpen = ref(false);

const openEditModal = (member) => {
  // 클릭한 행의 데이터를 깊은 복사하여 담기
  Modifymember.value = { ...member };
  sup_file.value = member?.sup_file || "";
  isEditModalOpen.value = true;
};
const closeEditModal = () => {
  isEditModalOpen.value = false;
  Modifymember.value = null; // 수정 중이던 데이터 초기화
  sup_file.value = "";
};
// 지원자 정보 수정부분 데이터 저장
const updateMember = async () => {
  try {
    Modifymember.value.sup_file = sup_file.value;
    // 반드시 Modifymember.value를 두 번째 인자로 전달!
    const response = await axios.put(
      "http://localhost:3000/support/update",
      Modifymember.value,
    );

    if (response.status === 200) {
      alert("정보 수정 완료");
      isEditModalOpen.value = false;
      getList(); // location.reload() 대신 목록 다시 불러오기
    }
  } catch (error) {
    console.error("수정 실패:", error);
    alert("정보 수정을 실패 하였습니다.");
  }
};

// 장애 유형 보기 버튼 제어
const openDetailModal = async (member) => {
  selectMember.value = member;
  try {
    const response = await axios.get(
      "http://localhost:3000/support/disabilities",
      {
        params: { sup_num: member.sup_num },
      },
    );
    selectMember.value.disabilities = response.data;
    detailModal.value = true;
    console.log("장애유형 가져오기 성공:", response.data);
  } catch (err) {
    console.error("장애유형 가져오기 실패:", err);
    alert("장애 유형정보를 가져오는 중에 에러 발생");
  }
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

// 지원자 목록 데이터 부분
const supported = ref([]);

// 데이터 가져오기
// 함수 선언
const getList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/support/list");
    console.log("서버 원본 응답:", response.data);

    if (response.data.retCode === "OK") {
      const result = response.data.result;

      if (Array.isArray(result)) {
        supported.value = result;
      } else if (result && typeof result === "object") {
        supported.value = result; // 객체 하나면 배열에 담기
      } else {
        supported.value = []; // 데이터가 없으면 빈 배열
      }

      console.log("Vue 변수에 담긴 최종 데이터:", supported.value);
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};
onMounted(() => {
  getList();
});
// 지원자 추가등록 모달 제어
const addModal = ref(false); // 등록 모달 열림

// 지원자 등록 시 입력 하는 부분
const newSupported = ref({
  sup_name: "",
  sup_birthday: "",
  sup_gender: "",
  sup_tel: "",
  sup_address: "",
  disability_category: "",
  sup_file: "",
});
// 등록 모달창 여는 함수
const openAddModal = () => {
  addModal.value = true;
};
// 지원자 등록 모달창 닫을 때 초기화
const closeModal = () => {
  addModal.value = false;

  newSupported.value = {
    sup_name: "",
    sup_birthday: "",
    sup_gender: "",
    sup_tel: "",
    sup_address: "",
    disability_category: "",
    sup_file: "",
  };
};

// 지원자 데이터를 서버에 저장
const addSupported = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/support/add",
      newSupported.value,
    );
    if (response.data.retCode === "OK") {
      alert("등록 완료");
      closeModal();
    }
  } catch (err) {
    console.log("등록 오류:", err);
  }
};
</script>
<template>
  <div class="container-fluid pt-6 pb-5 approval-layout">
    <div class="row wide-row">
      <aside class="col-lg-3 pe-lg-4">
        <div class="card shadow-sm mb-4 border-0 overflow-hidden">
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
                  router.push('/support/supported');
                "
              >
                지원자 현황
              </li>
              <li
                :class="{ active: currentTab === 'info' }"
                @click="
                  currentTab = 'info';
                  router.push('/support/info');
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
                <button class="btn btn-sm btn-outline-success mb-0 active">
                  전체
                </button>
                <button class="btn btn-sm btn-outline-success mb-0">남성</button>
                <button class="btn btn-sm btn-outline-success mb-0">여성</button>
              </div>
            </div>
            <div class="mb-3">
              <label class="text-xs fw-bold text-success">장애유형</label>
              <input
                type="text"
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
                      생년월일
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      휴대폰
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      주소
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      장애유형
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      담당자
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      등록일
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
                        v-if="member.gender === 'm1' || member.gender === '남성'"
                        class="badge badge-sm bg-gradient-info"
                        >남성</span
                      >
                      <span
                        v-else-if="
                          member.gender === 'f1' || member.gender === '여성'
                        "
                        class="badge badge-sm bg-gradient-danger"
                        >여성</span
                      >
                      <span v-else class="badge badge-sm bg-gradient-secondary"
                        >미정</span
                      >
                    </td>
                    <td class="text-center text-xs font-weight-bold text-dark">
                      {{ member.birthday ? member.birthday.split("T")[0] : "-" }}
                    </td>
                    <td class="text-center text-xs text-dark">
                      {{ member.sup_tel || "-" }}
                    </td>
                    <td class="text-center text-xs text-secondary">
                      {{ member.sup_address || "-" }}
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
                    <td class="text-center text-xs font-weight-bold text-secondary">
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
                        수정
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
  </div>
  <!-- 모달창 부분 -->
  <!-- 지원자의 장애 유형 보는 모달 창 -->
  <div v-if="detailModal" class="modal-overlay">
    <div class="card modal-content border-radius-xl shadow-xl p-4">
      <h5 class="font-weight-bolder text-success mb-3">장애유형 상세</h5>
      <div class="bg-gray-100 p-3 border-radius-lg mb-4 text-sm">
        지원자:
        <strong class="text-dark">{{ selectMember?.sup_name }}</strong>
      </div>
      <table class="table mb-0">
        <thead>
          <tr class="text-xxs font-weight-bolder">
            <th class="text-center">번호</th>
            <th>장애유형</th>
            <th>정도</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in selectMember?.disabilities" :key="index">
            <td class="text-center text-xs">{{ index + 1 }}</td>
            <td class="text-xs">{{ item.type }}</td>
            <td class="text-xs">{{ item.level }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn bg-gradient-dark w-100 mb-0 mt-4" @click="closeDetailModal">
        창 닫기
      </button>
    </div>
  </div>

  <!-- 지원자 정보 수정 모달창 -->
  <div v-if="isEditModalOpen && Modifymember" class="modal-overlay">
    <div class="card modal-content border-radius-xl shadow-xl p-4">
      <h5 class="font-weight-bolder text-dark mb-4 border-bottom pb-2">
        지원자 상세 정보 수정
      </h5>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">이름</label>
        <input type="text" v-model="Modifymember.sup_name" class="form-control border p-2" />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">휴대폰 번호</label>
        <input type="text" v-model="Modifymember.sup_tel" class="form-control border p-2" />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">주소</label>
        <input type="text" v-model="Modifymember.sup_address" class="form-control border p-2" />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">장애유형 추가</label>
        <input
          type="text"
          v-model="Modifymember.disability_category"
          class="form-control border p-2"
          placeholder="추가할 유형 입력"
        />
      </div>
      <div class="mb-4">
        <label class="text-xs fw-bold text-success">첨부파일명</label>
        <input
          type="text"
          v-model="sup_file"
          class="form-control border p-2"
          placeholder="파일명 입력 (pdf/jpg 등)"
        />
      </div>
      <div class="d-flex gap-2">
        <button class="btn bg-gradient-success w-100 mb-0 fw-bold" @click="updateMember">
          저장하기
        </button>
        <button class="btn btn-outline-secondary w-100 mb-0" @click="closeEditModal">
          취소
        </button>
      </div>
    </div>
  </div>
  <!-- 지원자 등록 부분 모달창 -->
  <div v-if="addModal" class="modal-overlay">
    <div class="card modal-content border-radius-xl shadow-xl p-4">
      <h5 class="font-weight-bolder text-success mb-4 border-bottom pb-2">
        신규 지원자 등록
      </h5>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">지원자명</label>
        <input type="text" v-model="newSupported.sup_name" class="form-control border p-2" />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">생년월일</label>
        <input
          type="text"
          v-model="newSupported.sup_birthday"
          class="form-control border p-2"
          placeholder="YYYY-MM-DD"
        />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success d-block">성별</label>
        <div class="d-flex gap-3 p-2 bg-gray-100 border-radius-lg text-sm">
          <label class="mb-0"
            ><input type="radio" v-model="newSupported.sup_gender" value="남성" />
            남성</label
          >
          <label class="mb-0"
            ><input type="radio" v-model="newSupported.sup_gender" value="여성" />
            여성</label
          >
        </div>
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">휴대폰 번호</label>
        <input type="text" v-model="newSupported.sup_tel" class="form-control border p-2" />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">주소</label>
        <input type="text" v-model="newSupported.sup_address" class="form-control border p-2" />
      </div>
      <div class="mb-3">
        <label class="text-xs fw-bold text-success">장애유형</label>
        <input
          type="text"
          v-model="newSupported.disability_category"
          class="form-control border p-2"
          placeholder="예: 발달장애"
        />
      </div>
      <div class="mb-4">
        <label class="text-xs fw-bold text-success">첨부파일</label>
        <input
          type="text"
          v-model="newSupported.sup_file"
          class="form-control border p-2"
          placeholder="파일명 입력 (pdf/jpg 등)"
        />
      </div>
      <div class="d-flex gap-2">
        <button class="btn bg-gradient-success w-100 mb-0 fw-bold" @click="addSupported">
          등록 완료
        </button>
        <button class="btn btn-outline-secondary w-100 mb-0" @click="closeModal">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.approval-layout {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.wide-row {
  max-width: 1600px;
  margin: 0 auto;
}

.main-content-card {
  height: auto;
  min-height: 750px;
  background-color: #ffffff;
  overflow: visible;
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
  transition: all 0.2s ease;
  position: relative;
}

.menu-list li:hover {
  background-color: rgba(var(--app-accent-rgb), 0.12);
  color: var(--app-accent);
  font-weight: 600;
}

.menu-list li.active {
  color: var(--app-accent);
  font-weight: 700;
}

.menu-list li.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: var(--app-accent);
}

.table-hover-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
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
  padding: 18px;
}

.modal-content {
  max-width: 650px;
  width: 100%;
  animation: appFadeInUp 0.35s ease-out;
}
</style>
