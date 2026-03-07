<script setup>
import { useMemberStore } from "@/store/member";
import { useDocStore } from "@/store/doc";
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
const plans = ref([]);
const results = ref([]);
const userAnswers = ref({});
const formData = ref([]);
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
  // 결과: "2026. 2. 22."
};

const docName = {
  document: "지원신청서",
  plan: "지원계획서",
  result: "지원결과서",
};
const getList = async () => {
  const result = await axios.get("http://localhost:3000/document/list", {
    params: {
      id: memberStore.id || "",
      grade: memberStore.grade || "",
      centerCode: memberStore.center || "",
      writer: searchQuery.value.writer || "",
      maneger: searchQuery.value.maneger || "",
      sup: searchQuery.value.sup || "",
    },
  });
  list.value = result.data.result;
  console.log(result.data);
  return result;
};
//선택한 신청서 조회
const getDocument = async (doc) => {
  modalType.value = "document";
  await getForm(doc.form_ver);
  await getResp(doc.doc_num);
  // console.log(formData.value);
  console.log(userAnswers.value);
  selectedDocData.value = doc;
  isModalOpen.value = true;
};
//선택한 신청서의 계획 조회
const getPlan = async (doc) => {
  modalType.value = "plan";
  const result = await axios
    .get(`http://localhost:3000/document/planlist/${doc.doc_num}`)
    .catch((err) => console.log(err));
  console.log(result.data);
  plans.value = result.data.result;
  selectedDocData.value = doc;
  isModalOpen.value = true;
};
//선택한 신청서의 결과 조회
const getResult = async (doc) => {
  modalType.value = "result";
  const result = await axios
    .get(`http://localhost:3000/document/resultlist/${doc.doc_num}`)
    .catch((err) => console.log(err));
  console.log(result.data);
  results.value = result.data.result;
  selectedDocData.value = doc;
  isModalOpen.value = true;
};
//모달닫기
const closeModal = () => {
  isModalOpen.value = false;
};
//신청서작성으로 이동
const moveRegister = () => {
  router.push("/document/write");
};
//문서 조회
const selectDoc = (doc_num) => {
  if (memberStore.grade == "a1") {
    return;
  }
  console.log(doc_num);
  docStore.setDoc(doc_num);
  router.push("/work");
};
//양식조회
const getForm = async (form_ver) => {
  // console.log(doc.value);
  const result = await axios.get(
    `http://localhost:3000/form/getForm/${form_ver}`,
  );
  // console.log(result);
  formData.value = result.data.form;

  // formData.value.forEach((bcategory) => {
  //   // console.group(bcategory);
  //   bcategory.scategory.forEach((scategory) => {
  //     // console.log(scategory);
  //     scategory.questions.forEach((question) => {
  //       // console.log(question);
  //       userAnswers.value[question.question_num] = {
  //         type: question.response,
  //         response: "",
  //       };
  //     });
  //   });
  // });
};
//응답 조회
const getResp = async (doc_num) => {
  const result = await axios.get(
    `http://localhost:3000/document/getResp/${doc_num}`,
  );
  // console.log(result.data.response);
  for (const key in result.data.response) {
    if (!Object.hasOwn(result.data.response, key)) continue;

    userAnswers.value[key] = result.data.response[key];
  }
};
onBeforeMount(async () => {
  await getList();
});
</script>
<template>
  <div class="container-fluid pt-6 pb-5 work-layout">
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
                >지원자</label
              >
              <material-input
                id="sup"
                v-model="searchQuery.sup"
                variant="static"
                placeholder="지원자명 입력"
              />
            </div>
            <div class="mb-4">
              <label class="form-label text-xs fw-bolder mb-1 text-secondary"
                >보호자</label
              >
              <material-input
                id="writer"
                v-model="searchQuery.writer"
                variant="static"
                placeholder="보호자명 입력"
              />
            </div>
            <div class="mb-4">
              <label class="form-label text-xs fw-bolder mb-1 text-secondary"
                >담당자</label
              >
              <material-input
                id="maneger"
                v-model="searchQuery.maneger"
                variant="static"
                placeholder="담당자명 입력"
              />
            </div>
            <button
              type="button"
              class="btn btn-sm w-100 bg-gradient-success text-white"
              @click="getList()"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="application-card card shadow-lg border-0 border-radius-xl">
          <div
            class="card-header p-3 bg-gradient-success shadow-success border-radius-lg"
          >
            <h6 class="mb-0 text-white font-weight-bolder">지원 신청 내역</h6>
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
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(doc, index) in list"
                    :key="doc.doc_num"
                    @click="selectDoc(doc.doc_num)"
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
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="bottom-actions d-flex justify-content-between align-items-center p-3 mt-2"
            >
              <material-pagination>
                <material-pagination-item prev />
                <material-pagination-item label="1" active />
                <material-pagination-item label="2" />
                <material-pagination-item next />
              </material-pagination>

              <button
                type="button"
                class="btn btn-sm bg-gradient-success text-white mb-0"
                @click="moveRegister()"
              >
                <i class="material-icons text-sm me-2">edit</i>신청서작성
              </button>
            </div>
          </div>
        </div>
      </div>
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
      <div class="card shadow-lg w-100 modal-content-scroll">
        <div
          class="card-header p-3 pb-0 d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">{{ docName[modalType] }}</h5>
          <button type="button" class="btn-close text-dark" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <hr class="dark horizontal my-2" />
        <div class="card-body modal-body p-4">
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
                <div v-if="modalType == 'document'">
                  <section
                    v-for="big in formData"
                    :key="big.bcategory"
                    class="big-section"
                  >
                    <h1 class="big-title">{{ big.bcategory }}</h1>

                    <div
                      v-for="small in big.scategory"
                      :key="small.scategory"
                      class="small-group"
                    >
                      <h2 class="small-title">▣ {{ small.scategory }}</h2>

                      <div
                        v-for="q in small.questions"
                        :key="q.question_num"
                        class="question-card"
                      >
                        <p class="question-text">
                          <span class="q-num"></span>
                          {{ q.question }}
                        </p>

                        <div class="answer-area">
                          <div v-if="q.options.length > 0" class="radio-group">
                            <label
                              v-for="opt in q.options"
                              :key="opt.exam_num"
                              class="radio-item"
                            >
                              <input
                                type="radio"
                                :name="q.question_num"
                                :value="opt.exam_num"
                                v-model="userAnswers[q.question_num]"
                                :disabled="true"
                              />
                              {{ opt.value }}
                            </label>
                          </div>

                          <div v-else class="text-group">
                            <textarea
                              v-model="userAnswers[q.question_num]"
                              placeholder="답변을 입력해주세요."
                              :readonly="true"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div v-if="modalType == 'result'">
                  <div class="card-body modal-body">
                    <div class="row">
                      <div
                        class="col-12 mb-4"
                        v-for="result of results"
                        :key="result.result_num"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <h5 class="fw-bold mb-0">
                            제목: {{ result.result_title }}
                          </h5>
                          <span class="text-muted small"
                            >작성일: {{ formatDate(result.result_date) }}</span
                          >
                        </div>

                        <div>
                          <label class="fw-bold d-block mb-1">내용:</label>
                          <p
                            class="text-secondary"
                            style="white-space: pre-wrap"
                          >
                            {{ result.result_contnet }}
                          </p>
                        </div>

                        <hr class="border-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="modalType == 'plan'">
                  <div class="card-body modal-body">
                    <div class="row">
                      <div
                        class="col-12 mb-4"
                        v-for="plan of plans"
                        :key="plan.plan_num"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <h5 class="fw-bold mb-0">
                            제목: {{ plan.plan_title }}
                          </h5>
                          <span class="text-muted small"
                            >작성일: {{ formatDate(plan.plan_date) }}</span
                          >
                        </div>

                        <div>
                          <label class="fw-bold d-block mb-1">내용:</label>
                          <p
                            class="text-secondary"
                            style="white-space: pre-wrap"
                          >
                            {{ plan.plan_contnet }}
                          </p>
                        </div>

                        <hr class="border-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end p-3">
          <material-button
            v-if="modalType == 'document'"
            color="success"
            variant="gradient"
            @click="closeModal"
            >수정</material-button
          >
          <material-button
            v-if="modalType == 'document'"
            color="success"
            variant="gradient"
            @click="closeModal"
            >삭제</material-button
          >
          <material-button
            color="secondary"
            variant="gradient"
            @click="closeModal"
            >닫기</material-button
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
/* work.vue / list.vue 동일 레이아웃 */
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

.bottom-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

button {
  cursor: pointer;
}

/* 1. 모달 전체 영역에서 포인터 이벤트가 투명하게 본문으로 전달되도록 설정 */
.modal {
  pointer-events: none;
}

/* 2. 실제 다이얼로그 박스만 이벤트를 다시 활성화 */
.modal-dialog {
  pointer-events: auto;
  display: flex;
  align-items: center;
  min-height: calc(100% - 3.5rem); /* 중앙 정렬 유지 */
}

/* 3. 본문 영역의 스크롤을 확실하게 보장 */
.modal-content-scroll {
  display: flex;
  flex-direction: column;
  height: 85vh; /* 높이를 명시적으로 고정 */
  overflow: hidden; /* 헤더/푸터는 고정 */
}

.modal-body {
  flex: 1 1 auto; /* 남은 공간을 꽉 채움 */
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch; /* 모바일 대응 */
  position: relative; /* 내부 요소 위치 계산 기준 */
}
</style>
