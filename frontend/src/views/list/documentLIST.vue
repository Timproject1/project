<script setup>
import { useMemberStore } from "@/store/member";
import { useDocStore } from "../../store/doc";
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const memberStore = useMemberStore();
const docStore = useDocStore();
const searchQuery = ref({ writer: "", maneger: "", sup: "" });
const list = ref([]);
const isModalOpen = ref(false); // 모달 열림 상태
const modalType = ref(""); // 어떤 서류인지 (doc, plan, result)
const selectedDocData = ref({}); // 모달에 표시할 데이터
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
  // 결과: "2026. 2. 22."
};
const getList = async () => {
  const result = await axios.get("http://localhost:3000/document/list", {
    params: {
      id: memberStore.id ? memberStore.id : "",
      grade: memberStore.grade ? memberStore.grade : "",
      writer: searchQuery.value.writer,
      maneger: searchQuery.value.maneger,
      sup: searchQuery.value.sup,
    },
  });
  list.value = result.data.result;
  console.log(result.data);
  return result;
};
const getDocument = (doc) => {
  modalType.value = "document";
  selectedDocData.value = doc;
  isModalOpen.value = true;
};

const getPlan = (doc) => {
  modalType.value = "plan";
  selectedDocData.value = doc;
  isModalOpen.value = true;
};

const getResult = (doc) => {
  modalType.value = "result";
  selectedDocData.value = doc;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
const moveRegister = () => {
  router.push("/document/write");
};
const selectDoc = (doc_num) => {
  console.log(doc_num);
  docStore.setDoc(doc_num);
  router.push("/work");
};
onBeforeMount(async () => {
  await getList();
});
</script>
<template>
  <div class="container-fluid py-4">
    <div class="d-flex gap-4 align-items-start">
      <aside
        class="rounded-3 shadow-dark p-3 text-white"
        style="
          min-width: 240px;
          background-color: #adb5bd;
          border-radius: 0.75rem;
        "
      >
        <div class="d-flex align-items-center mb-4 ps-2">
          <i class="material-icons opacity-10 me-2">search</i>
          <span class="fw-bold">검색 필터</span>
        </div>

        <div class="px-2">
          <div class="mb-4">
            <label class="form-label text-white text-xs fw-bolder mb-1"
              >지원자</label
            >
            <material-input
              id="sup"
              v-model="searchQuery.sup"
              variant="static"
              color="white"
              placeholder="지원자명 입력"
              class="text-white"
            />
          </div>

          <div class="mb-4">
            <label class="form-label text-white text-xs fw-bolder mb-1"
              >보호자</label
            >
            <material-input
              id="writer"
              v-model="searchQuery.writer"
              variant="static"
              color="white"
              placeholder="보호자명 입력"
            />
          </div>

          <div class="mb-4">
            <label class="form-label text-white text-xs fw-bolder mb-1"
              >담당자</label
            >
            <material-input
              id="maneger"
              v-model="searchQuery.maneger"
              variant="static"
              color="white"
              placeholder="담당자명 입력"
            />
          </div>

          <material-button
            color="success"
            variant="gradient"
            class="w-100 mt-3 mb-2"
            @click="getList()"
            >검색</material-button
          >
        </div>
      </aside>

      <main class="flex-grow-1">
        <div class="card shadow-sm">
          <div class="card-header p-3">
            <h6 class="mb-0 font-weight-bolder">지원 신청 내역</h6>
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
                      보호자명
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      신청일
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      신청서
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      담당자
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      계획서
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      결과서
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      단계
                    </th>
                    <th>test</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(doc, index) in list"
                    :key="doc.doc_num"
                    @click="selectDoc(doc)"
                  >
                    <td class="text-center text-sm">
                      {{ list.length - index }}
                    </td>
                    <td class="ps-4 text-sm font-weight-bold">
                      {{ doc.sup_name }}
                    </td>
                    <td class="text-center text-sm">{{ doc.writer_name }}</td>
                    <td class="text-center text-sm">
                      {{ formatDate(doc.write_date) }}
                    </td>
                    <td class="text-center">
                      <material-button
                        size="sm"
                        color="info"
                        variant="text"
                        class="mb-0"
                        @click.stop="getDocument(doc)"
                        >보기</material-button
                      >
                    </td>
                    <td class="text-center text-sm">
                      {{ doc.manager_name }}
                    </td>
                    <td class="text-center">
                      <material-button
                        size="sm"
                        color="dark"
                        variant="outline"
                        class="mb-0 px-3"
                        @click.stop="getPlan(doc)"
                        >보기</material-button
                      >
                    </td>
                    <td class="text-center">
                      <material-button
                        size="sm"
                        color="dark"
                        variant="outline"
                        class="mb-0 px-3"
                        @click.stop="getResult(doc)"
                        >보기</material-button
                      >
                    </td>
                    <td class="text-center">
                      <span class="badge badge-sm bg-gradient-success">{{
                        doc.progress
                      }}</span>
                    </td>
                    <td>
                      {{ doc.doc_num }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="d-flex justify-content-between align-items-center p-3 mt-2"
            >
              <material-pagination>
                <material-pagination-item prev />
                <material-pagination-item label="1" active />
                <material-pagination-item label="2" />
                <material-pagination-item next />
              </material-pagination>

              <material-button
                color="success"
                variant="gradient"
                class="mb-0"
                @click="moveRegister()"
              >
                <i class="material-icons text-sm me-2">edit</i>신청서작성
              </material-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
  <div
    class="modal fade"
    :class="{ 'show d-block': isModalOpen }"
    tabindex="-1"
    role="dialog"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="card shadow-lg w-100">
        <div
          class="card-header p-3 pb-0 d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">{{ modalType }} 상세 정보</h5>
          <button type="button" class="btn-close text-dark" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <hr class="dark horizontal my-2" />
        <div class="card-body p-4">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label fw-bold">지원자명:</label>
              <p>{{ selectedDocData.sup_name }}</p>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label fw-bold">보호자명:</label>
              <p>{{ selectedDocData.writer_name }}</p>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label fw-bold">담당자명:</label>
              <p>{{ selectedDocData.manager_name }}</p>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label fw-bold">진행단계:</label>
              <p>{{ selectedDocData.progress }}</p>
            </div>
            <div class="col-12">
              <label class="form-label fw-bold">상세 내용:</label>
              <div class="p-3 bg-gray-100 border-radius-lg">
                {{ modalType }}에 대한 상세 데이터가 여기에 표시됩니다. <br />
                현재 단계: {{ selectedDocData.progress }}
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end p-3">
          <material-button
            color="secondary"
            variant="gradient"
            @click="closeModal"
            >닫기</material-button
          >
          <material-button color="success" variant="gradient" class="ms-2"
            >출력하기</material-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialInput from "@/components/MaterialInput.vue";

export default {
  name: "tables",
  components: {
    MaterialButton,
    MaterialPagination,
    MaterialPaginationItem,
    MaterialInput,
  },
};
</script>
<style scoped>
.modal-backdrop.show {
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1050;
  background-color: #000;
}

.modal.show.d-block {
  display: block;
  z-index: 1055;
  background: rgba(0, 0, 0, 0.1); /* 배경 투명도 조절 */
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
