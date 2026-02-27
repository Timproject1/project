<script setup>
import { ref } from "vue";
// import { useMemberStore } from "@/store/member";
// import axios from "axios";
// const memberStore = useMemberStore(); //pinia에서 로그인 정보 스토어
import MaterialButton from "@/components/MaterialButton.vue";

import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";

// export default {
//   name: "tables",
//   components: {
//     MaterialButton,
//     MaterialInput,
//   },
// };
const formData = ref([]); //설문지 양식

const addQuestion = (subCategory) => {
  subCategory.questions.push({
    question: "",
    type: "i1",
    option: [],
  });
};

// 소분류 추가 (특정 대분류 내부에 추가)
const addScategory = (category) => {
  const newSmall = {
    name: "",
    questions: [],
  };
  category.scategory.push(newSmall);
  addQuestion(newSmall);
};

// 대분류 추가
const addBcategory = () => {
  const newBig = {
    name: "",
    scategory: [],
  };
  formData.value.push(newBig);
  addScategory(newBig);
};
//질문삭제
const delQuestion = (small, idx) => {
  console.log(small);
  small.questions.splice(idx, 1);
};
//소분류삭제
const delScategory = (big, idx) => {
  big.scategory.splice(idx, 1);
};
//대분류 삭제
const delBigcategory = (idx) => {
  console.log(formData.value);
  formData.value.splice(idx, 1);
};

const handleTypeChange = (q) => {
  let count = 0;
  if (q.type == "i2") {
    count = 2;
  } else if (q.type == "i3") {
    count = 5;
  }

  if (count > 0) {
    const currentOptions = q.options || [];
    if (currentOptions.length < count) {
      // 모자란 만큼 빈 문자열 추가
      const added = Array(count - currentOptions.length).fill("");
      q.options = [...currentOptions, ...added];
    }
    if (currentOptions.length > count) {
      const newOpt = [];
      let max = count;
      for (const option of q.options) {
        if (option) {
          newOpt.push(option);
          max--;
        }
        if (max == 0) {
          break;
        }
      }
      while (max > 0) {
        newOpt.push("");
        max--;
      }
      q.options = newOpt;
    }
  } else {
    q.option = [];
  }
};
addBcategory();
const submitForm = async () => {
  console.log(formData);
  await axios.post(
    "http://localhost:3000/form/write",
    {
      form: formData.value,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

//값 초기화
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
              <h6 class="text-white text-capitalize ps-3">신청서 양식 작성</h6>
            </div>
          </div>

          <div class="card-body px-4 pb-2">
            <div v-if="Object.keys(formData).length">
              <section
                v-for="(big, bIdx) in formData"
                :key="big.bcategory"
                class="big-section"
              >
                <h1 class="big-title">대분류명</h1>
                <button
                  type="button"
                  @click="delBigcategory(bIdx)"
                  :disabled="formData.length <= 1"
                >
                  지우기
                </button>
                <material-input
                  :type="text"
                  placeholder="대분류"
                  v-model="big.name"
                  >대분류</material-input
                >

                <button @click="addScategory(big)">소분류 추가</button>

                <div
                  v-for="(small, sIdx) in big.scategory"
                  :key="small.scategory"
                  class="small-group"
                >
                  <h2 class="small-title">소분류명</h2>
                  <button
                    type="button"
                    :disabled="big.scategory.length <= 1"
                    @click="delScategory(big, sIdx)"
                  >
                    지우기
                  </button>
                  <material-input
                    :type="text"
                    placeholder="소분류"
                    v-model="small.name"
                    >소분류</material-input
                  >
                  <button type="button" @click="addQuestion(small)">
                    질문추가
                  </button>
                  <div
                    v-for="(q, qIdx) in small.questions"
                    :key="q.question_num"
                    class="question-card"
                  >
                    <div class="question-card">
                      <div class="type-select-area">
                        <label>응답 타입: </label>
                        <select v-model="q.type" @change="handleTypeChange(q)">
                          <option value="i1">자유 응답형</option>
                          <option value="i2">2지선다형</option>
                          <option value="i3">5지선다형</option></select
                        ><button
                          type="button"
                          :disabled="small.questions.length <= 1"
                          @click="delQuestion(small, qIdx)"
                        >
                          지우기
                        </button>
                      </div>
                      <material-input
                        v-model="q.question"
                        placeholder="질문을 입력하세요"
                      />

                      <div v-if="q.type != 'i1'" class="options-container">
                        <div
                          v-for="(opt, oIdx) in q.options"
                          :key="oIdx"
                          class="option-input-group"
                        >
                          <span>{{ oIdx + 1 }}번 선택지: </span>
                          <input
                            v-model="q.options[oIdx]"
                            type="text"
                            :placeholder="oIdx + 1 + '번 내용을 입력하세요'"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="answer-area">
                      <!-- <div v-if="q.options.length > 0" class="radio-group">
                        <label
                          v-for="opt in q.options"
                          :key="opt.exam_num"
                          class="radio-item"
                        >
                          <input
                            type="radio"
                            :name="q.question_num"
                            :value="opt.exam_num"
                          />
                          {{ opt.value }}
                        </label>
                      </div> -->

                      <!-- <div v-else class="text-group">
                        <textarea placeholder="답변을 입력해주세요."></textarea>
                      </div> -->
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <button @click="addBcategory">대분류 추가</button>
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

<style scoped>
.form-control,
.form-select {
  border: 1px solid #d2d6da !important;
}
.bg-light {
  background-color: #f8f9fa !important;
}
</style>
