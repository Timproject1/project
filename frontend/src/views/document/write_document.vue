<script setup>
import { reactive, ref } from "vue";
import { useMemberStore } from "@/store/member";
import axios from "axios";
const memberStore = useMemberStore();
const nums = ref([]);
const formData = reactive({
  name: "김민서",
  num: "",
  disabilityType: "",
  gender: "",
  birthDate: "",
  q1: null,
  q2: null,
});
const getList = async () => {
  const result = await axios.get(
    `http://localhost:3000/support/nums/${memberStore.id}`,
  );
  console.log(result);
  nums.value = result.data.result;
  console.log(nums.value);
};
const saveTemp = () => {
  console.log("임시저장", formData);
};
const submitForm = () => {
  console.log("제출", formData);
};
const cancel = () => {
  console.log("취소");
};
getList();
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
                <select class="form-select border p-2" v-model="formData.num">
                  <option
                    v-for="num in nums"
                    :value="num.sup_num"
                    :key="num.sup_num"
                  >
                    {{ num.sup_name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">장애유형</label>
                <input
                  type="text"
                  class="form-control border p-2"
                  v-model="formData.disabilityType"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label">성별</label>
                <input
                  type="text"
                  class="form-control border p-2"
                  v-model="formData.gender"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">생년월일</label>
                <input
                  type="date"
                  class="form-control border p-2"
                  v-model="formData.birthDate"
                />
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-outline-primary w-100 mb-0">
                  불러오기
                </button>
              </div>
            </div>

            <hr class="dark horizontal" />

            <div class="mt-4">
              <h6 class="mb-3">지원사유</h6>

              <div class="table-responsive p-0 border border-radius-lg mb-4">
                <div class="bg-light p-2 ps-3 fw-bold">긴급</div>
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        질문
                      </th>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                      >
                        응답
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p class="text-sm font-weight-bold mb-0 ps-3">
                          보호자가 존재하지 않는다
                        </p>
                      </td>
                      <td>
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="urgent"
                            id="u1"
                            value="yes"
                            v-model="formData.q1"
                          />
                          <label class="form-check-label" for="u1">네</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="urgent"
                            id="u2"
                            value="no"
                            v-model="formData.q1"
                          />
                          <label class="form-check-label" for="u2"
                            >아니오</label
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="table-responsive p-0 border border-radius-lg mb-4">
                <div class="bg-light p-2 ps-3 fw-bold">중점</div>
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        질문
                      </th>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                      >
                        응답
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p class="text-sm font-weight-bold mb-0 ps-3">
                          보호자가 존재하나 60세 이상이다
                        </p>
                      </td>
                      <td>
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="focus"
                            id="f1"
                            value="yes"
                            v-model="formData.q2"
                          />
                          <label class="form-check-label" for="f1">네</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="focus"
                            id="f2"
                            value="no"
                            v-model="formData.q2"
                          />
                          <label class="form-check-label" for="f2"
                            >아니오</label
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="d-flex justify-content-center gap-2 mt-4">
              <button class="btn bg-gradient-secondary" @click="saveTemp">
                임시저장
              </button>
              <button class="btn bg-gradient-primary" @click="submitForm">
                제출
              </button>
              <button class="btn btn-outline-danger" @click="cancel">
                취소
              </button>
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
