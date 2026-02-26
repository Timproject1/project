<script setup>
// import MaterialButton from "@/components/MaterialButton.vue";
// import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { useDocStore } from "@/store/doc";
const docStore = useDocStore();

// const router = useRouter();

// const goplan = () => {
//   router.push("/work/plan");
// };

// const gopriority = () => {
//   router.push("/work/priority");
// };

// const gorecord = () => {
//   router.push("/work/record");
// };

// const goresult = () => {
//   router.push("/work/result");
// };

// const gorepresentative = () => {
//   router.push("/work/representative");
// };

const doc = ref({});
const formData = ref([]);
const userAnswers = ref({});

//신청서 받아오기
const getDoc = async () => {
  // console.log(docStore.doc_num);
  let result = await axios(
    `http://localhost:3000/document/getDoc/${docStore.doc_num}`,
  ).catch((err) => console.error(err));
  doc.value = result.data.result[0];
  // console.log(doc.value);
};
//신청서 양식받아오기
const getForm = async () => {
  // console.log(doc.value);
  const result = await axios.get(
    `http://localhost:3000/document/getForm/${doc.value.form_ver}`,
  );
  console.log(result);
  formData.value = result.data.form;

  formData.value.forEach((bcategory) => {
    // console.group(bcategory);
    bcategory.scategory.forEach((scategory) => {
      // console.log(scategory);
      scategory.questions.forEach((question) => {
        console.log(question);
        userAnswers.value[question.question_num] = {
          type: question.response,
          response: "",
        };
      });
    });
  });
};
//신청서 응답 받아오기
const getResp = async () => {
  const result = await axios.get(
    `http://localhost:3000/document/getResp/${doc.value.doc_num}`,
  );

  console.log(result.data.response);
  for (const key in result.data.response) {
    if (!Object.hasOwn(result.data.response, key)) continue;

    userAnswers.value[key].response = result.data.response[key];
  }
};
// import { useRouter } from "vue-router";
// const router = useRouter();
// const gotodoc = async (docno) => {
// router.push({ path: "info", query: { no: docno } });
// };

onBeforeMount(async () => {
  await getDoc();
  await getForm();
  await getResp();
});
</script>

<template>
  <div class="layout">
    <div class="container">
      <div class="left">
        <!-- <RouterView name="left" /> -->
        <div class="top-actions">
          <button @click="currentView = 'assignee'" class="btn-blue">
            담당자 변경
          </button>
          <button @click="currentView = 'priority'" class="btn-blue">
            우선순위 선택
          </button>
        </div>

        <div class="tab-menu">
          <button @click="currentView = 'consult'" class="btn-tab">
            상담기록
          </button>
          <button @click="currentView = 'plan'" class="btn-tab">
            지원 계획서
          </button>
          <button @click="currentView = 'result'" class="btn-tab">
            지원 결과서
          </button>
        </div>

        <div class="application-card">
          <div class="card-header">
            <span class="title">지원신청서</span>
          </div>

          <div class="info-grid">
            <div class="info-item">이름:</div>
            <div class="info-item">보호자:</div>
            <div class="info-item">장애유형: 발달장애</div>
            <div class="info-item">성별:</div>
            <div class="info-item">대기 단계: {{ doc.progress }}</div>
            <div class="info-item">생년월일:</div>
          </div>
          <div class="date-stamp">2026-02-01 작성</div>

          <div class="content-area">
            <!-- <p class="placeholder-text">지원신청서 내용</p> -->
            <div v-if="Object.keys(userAnswers).length">
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
                            v-model="userAnswers[q.question_num].response"
                            :readonly="true"
                          />
                          {{ opt.value }}
                        </label>
                      </div>

                      <div v-else class="text-group">
                        <textarea
                          v-model="userAnswers[q.question_num].response"
                          placeholder="답변을 입력해주세요."
                          :readonly="true"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="bottom-actions">
            <button class="btn-gray">수정기록</button>
            <div class="right-group">
              <button class="btn-blue">수정</button>
              <button class="btn-orange">삭제</button>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <RouterView name="right" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* body 스크롤 차단 */
}

.left,
.right {
  flex: 1;
  overflow-y: auto; /* 각각 독립 스크롤 */
}
.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
}

.top-actions,
.tab-menu {
  display: flex;
  gap: 5px;
}

.application-card {
  border: 2px solid #999;
  background: #fffef0; /* 연한 노란색 바탕 */
  padding: 15px;
  flex-grow: 1;
  position: relative;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
  font-size: 0.9rem;
}

.content-area {
  margin-top: 40px;
  text-align: center;
  border: 1px solid #ccc;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

/* 오른쪽 패널 스타일 */
.right-panel {
  flex: 1;
  background-color: #e5e5e5;
  border: 1px solid #ccc;
  padding: 20px;
}

/* 공통 버튼 스타일 */
button {
  border: 1px solid #666;
  cursor: pointer;
  padding: 5px 10px;
}
.btn-blue {
  background-color: #8da9c4;
  color: white;
}
.btn-tab {
  background-color: #a3c1ad;
  flex: 1;
}
.btn-orange {
  background-color: #d88c51;
  color: white;
}
.btn-gray {
  background-color: #8da9c4;
}

.badge {
  background: #d35400;
  color: white;
  padding: 0 4px;
  font-size: 0.7rem;
  border-radius: 2px;
}
</style>
