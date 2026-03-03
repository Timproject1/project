<script setup>
import { ref, onBeforeMount, computed } from "vue";
// import { useMemberStore } from "@/store/member";
// import axios from "axios";
// const memberStore = useMemberStore(); //pinia에서 로그인 정보 스토어
import MaterialButton from "@/components/MaterialButton.vue";
// import MaterialInput from "@/components/MaterialInput.vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

// export default {
//   name: "tables",
//   components: {
//     MaterialButton,
//     MaterialInput,
//   },
// };
const route = useRoute();
const router = useRouter();
console.log(`route:${route.params.num}`);
const formData = ref([]); //설문지 양식
const info = ref({});
const usage = computed(() => {
  return info.value.usage == "사용중";
});
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
  // 결과: "2026. 2. 22."
};
const getForm = async () => {
  // console.log(route.params.num);
  const result = await axios.get(
    `http://localhost:3000/form/getForm/${route.params.num}`,
  );
  console.log(result.data);
  formData.value = result.data.form;

  // formData.value.forEach((bcategory) => {
  //   console.group(bcategory);
  //   bcategory.scategory.forEach((scategory) => {
  //     console.log(scategory);
  //     scategory.questions.forEach((question) => {
  //       console.log(question);
  //     });
  //   });
  // });
};
const getInfo = async () => {
  const result = await axios.get(
    `http://localhost:3000/form/getInfo/${route.params.num}`,
  );
  // console.log(result.data);
  info.value = result.data.info;
  console.log(info.value);
};
onBeforeMount(async () => {
  await getInfo();
  await getForm();
});
const use = async () => {
  const result = await axios.patch(
    `http://localhost:3000/form/usage/${route.params.num}`,
  );
  if (result.data.retCode == "OK") {
    alert("사용등록 완료");
    router.push("/list/form");
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
              <h6 class="text-white text-capitalize ps-3">신청서 양식 조회</h6>
            </div>
          </div>
          <div class="card-body px-4 pb-2">
            <div
              class="info-section bg-gray-100 border-radius-lg p-3 mb-4 d-flex flex-wrap justify-content-between align-items-center"
            >
              <div class="d-flex gap-4">
                <div class="info-item">
                  <span
                    class="text-xs font-weight-bold text-uppercase text-muted d-block"
                    >버전명</span
                  >
                  <span class="text-sm font-weight-bolder">{{
                    info.form_ver
                  }}</span>
                </div>
                <div class="info-item">
                  <span
                    class="text-xs font-weight-bold text-uppercase text-muted d-block"
                    >등록일</span
                  >
                  <span class="text-sm font-weight-bolder">{{
                    formatDate(info.writedate)
                  }}</span>
                </div>
              </div>
              <div class="info-item flex-grow-1 ms-lg-5 mt-2 mt-lg-0">
                <span
                  class="text-xs font-weight-bold text-uppercase text-muted d-block"
                  >코멘트</span
                >
                <span class="text-sm italic text-secondary">{{
                  info.comment
                }}</span>
              </div>
            </div>
          </div>

          <div class="card-body px-4 pb-2">
            <div class="content-area">
              <!-- <p class="placeholder-text">지원신청서 내용</p> -->
              <div v-if="Object.keys(formData).length">
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
                              disabled="true"
                            />
                            {{ opt.value }}
                          </label>
                        </div>

                        <div v-else class="text-group">
                          <textarea
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
            <div class="d-flex justify-content-center gap-2 mt-4">
              <material-button
                class="btn bg-gradient-secondary"
                @click="use"
                :disabled="usage"
              >
                사용
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
.content-area {
  /* 최대 높이를 설정 (화면의 약 60~70% 정도가 적당합니다) */
  max-height: 70vh;

  /* 내용이 넘칠 때만 세로 스크롤바 생성 */
  overflow-y: auto;

  /* 안쪽 여백을 주어 스크롤바와 내용이 겹치지 않게 함 */
  padding-right: 15px;

  /* (선택사항) 스크롤바 스타일링 - Chrome, Safari */
  border: 1px solid #f0f2f5;
  border-radius: 8px;
}

/* 스크롤바 디자인을 깔끔하게 만들고 싶다면 추가하세요 */
.content-area::-webkit-scrollbar {
  width: 6px;
}
.content-area::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 10px;
}
.content-area::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
