<script setup>
import { ref, onBeforeMount, computed } from "vue";
// import { useMemberStore } from "@/store/member";
// import axios from "axios";
// const memberStore = useMemberStore(); //pinia에서 로그인 정보 스토어
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";
import router from "../../router";

// export default {
//   name: "tables",
//   components: {
//     MaterialButton,
//     MaterialInput,
//   },
// };
const formData = ref([]); //설문지 양식
const list = ref([]);
const selectedVersion = ref("");
const comment = ref("");
//모든값이 다 들어가있는지 확인
const check = computed(() => {
  return formData.value.some((bcategory) => {
    if (!bcategory.name) return true;

    return bcategory.scategory.some((scategory) => {
      if (!scategory.name) return true;

      return scategory.questions.some((question) => {
        if (!question.question) return true;

        // 옵션 배열 중 하나라도 비어있으면 true
        return question.options.some(
          (option) => option === "" || option === null || option === undefined,
        );
      });
    });
  });
});
//버전목록 가져오기
const getList = async () => {
  const result = await axios.get("http://localhost:3000/form/vers");
  list.value = result.data.result;
  // console.log(result.data.result);
};
//지정한 버전 가지고 오기
const getForm = async () => {
  // console.log(route.params.num);
  const result = await axios.get(
    `http://localhost:3000/form/getForm/${selectedVersion.value}`,
  );
  console.log(result.data.form);
  // formData.value = result.data.form;
  const newForm = [];
  result.data.form.forEach((bcategory) => {
    const newBig = {
      name: bcategory.bcategory,
      scategory: [],
    };
    newForm.push(newBig);
    bcategory.scategory.forEach((scategory) => {
      const newSmall = {
        name: scategory.scategory,
        questions: [],
      };
      newBig.scategory.push(newSmall);
      scategory.questions.forEach((question) => {
        const newQue = {
          question: question.question,
          type: question.response,
          options: [],
        };
        newSmall.questions.push(newQue);
        question.options.forEach((option) => {
          newQue.options.push(option.value);
        });
      });
    });
    formData.value = newForm;
  });
  // formData.value.forEach((bcategory) => {
  //   console.log(bcategory);
  //   bcategory.scategory.forEach((scategory) => {
  //     console.log(scategory);
  //     scategory.questions.forEach((question) => {
  //       console.log(question);
  //     });
  //   });
  // });
};
//질문추가
const addQuestion = (subCategory) => {
  subCategory.questions.push({
    question: "",
    type: "l1",
    options: [],
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
  if (q.type == "l2") {
    count = 2;
  } else if (q.type == "l3") {
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
onBeforeMount(async () => {
  await getList();
  addBcategory();
});
const submitForm = async () => {
  console.log(formData);
  const result = await axios.post(
    "http://localhost:3000/form/write",
    {
      form: formData.value,
      comment: comment.value,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  if (result.data.retCode == "OK") {
    alert("등록완료 되었습니다");
    router.push(`/form/view/${result.data.form_ver}`);
  }
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
            <div class="row mb-4 border-bottom pb-4">
              <div class="col-md-4">
                <label class="form-label fw-bold">양식 버전 불러오기</label>
                <div class="d-flex gap-2">
                  <select
                    v-model="selectedVersion"
                    class="form-select border p-2"
                  >
                    <!-- <option value="">새 양식 작성</option> -->
                    <option
                      v-for="ver in list"
                      :key="ver.id"
                      :value="ver.form_ver"
                    >
                      {{ ver.form_ver }}
                    </option>
                  </select>
                  <material-button
                    size="sm"
                    variant="outline"
                    class="mb-0 text-nowrap"
                    @click="getForm"
                    >불러오기</material-button
                  >
                </div>
              </div>
              <div class="col-md-8">
                <label class="form-label fw-bold">양식 설명 (코멘트)</label>
                <material-input
                  v-model="comment"
                  placeholder="이 신청서 양식에 대한 설명을 입력하세요 (예: 2026년 상반기 정기 신청용)"
                  :type="text"
                />
              </div>
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
                          <option value="l1">자유 응답형</option>
                          <option value="l2">2지선다형</option>
                          <option value="l3">5지선다형</option></select
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

                      <div v-if="q.type != 'l1'" class="options-container">
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
                :disabled="check"
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
