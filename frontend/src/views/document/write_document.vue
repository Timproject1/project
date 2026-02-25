<script setup>
import { ref } from "vue";
import { useMemberStore } from "@/store/member";
import axios from "axios";
const memberStore = useMemberStore(); //pinia에서 로그인 정보 스토어
const sups = ref([]); //지원자 목록
const sup_num = ref("");
const userAnswers = ref({}); //유저답변 기록
const formData = ref([]); //설문지 양식
let formVer = ""; //설문지 버전
//지원자 목록을 가져온다
const getList = async () => {
  const result = await axios.get(`http://localhost:3000/support/list`, {
    params: {
      id: memberStore.id,
    },
  });
  // console.log(result.data.result);
  sups.value = result.data.result;
};
//설문지 양식을 가져온다
const getForm = async () => {
  const result = await axios.get(`http://localhost:3000/document/getForm`);
  console.log(result);
  formData.value = result.data.form;
  formVer = result.data.ver;
  console.log(formVer);
};
const saveTemp = () => {
  console.log("임시저장", userAnswers.value);
};
const submitForm = async () => {
  console.log(userAnswers.value);
  const surveyData = {
    sup_num: sup_num.value,
    formVer, // 처음에 서버에서 받았던 그 버전!
    response: userAnswers.value,
  };
  const result = await axios.post(
    `http://localhost:3000/document/write`,
    surveyData,
  );
  console.log(result);
};
//값 초기화
const cancel = () => {
  userAnswers.value = {};
};
getList();
getForm();
</script>
<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
              class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3"
            >
              <h6 class="text-white text-capitalize ps-3">
                지원 신청서 작성 / 지원자 정보
              </h6>
            </div>
          </div>

          <div class="card-body px-4 pb-2">
            <div class="row mb-4">
              <div class="col-md-3">
                <label class="form-label">이름</label>
                <select class="form-select border p-2" v-model="sup_num">
                  <option
                    v-for="sup in sups"
                    :value="sup.sup_num"
                    :key="sup.sup_num"
                  >
                    {{ sup.sup_name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <material-input type="text" class="form-control border p-2" />
              </div>
              <div class="col-md-2">
                <label class="form-label">성별</label>
              </div>
              <div class="col-md-3">
                <material-input
                  type="date"
                  class="form-control border p-2"
                  :readonly="true"
                />
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <material-button class="btn w-100 mb-0">
                  불러오기
                </material-button>
              </div>
            </div>

            <hr class="dark horizontal" />

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
                        :key="opt.number"
                        class="radio-item"
                      >
                        <input
                          type="radio"
                          :name="q.question_num"
                          :value="opt.number"
                          v-model="userAnswers[q.question_num]"
                        />
                        {{ opt.value }}
                      </label>
                    </div>

                    <div v-else class="text-group">
                      <textarea
                        v-model="userAnswers[q.question_num]"
                        placeholder="답변을 입력해주세요."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div class="d-flex justify-content-center gap-2 mt-4">
              <material-button
                class="btn bg-gradient-secondary"
                @click="saveTemp"
              >
                임시저장
              </material-button>
              <material-button
                class="btn bg-gradient-primary"
                @click="submitForm"
              >
                제출
              </material-button>
              <material-button class="btn btn-outline-danger" @click="cancel">
                취소
              </material-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";

import MaterialInput from "@/components/MaterialInput.vue";

export default {
  name: "tables",
  components: {
    MaterialButton,
    MaterialInput,
  },
};
</script>
<style scoped>
.form-control,
.form-select {
  border: 1px solid #d2d6da !important;
}
.bg-light {
  background-color: #f8f9fa !important;
}
</style>
