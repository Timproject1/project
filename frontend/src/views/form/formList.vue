<script setup>
// import { useMemberStore } from "@/store/member";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
// const memberStore = useMemberStore();
// const searchQuery = ref({ writer: "", maneger: "", sup: "" });
const list = ref([]);
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
  // 결과: "2026. 2. 22."
};
const getList = async () => {
  const result = await axios.get("http://localhost:3000/form/list");
  console.log(result.data);
  list.value = result.data.result;
  console.log(list.value);
};
// const getDocument = (doc_num) => {
//   console.log(`신청서 보기${doc_num}`);
// };
// const getPlan = (doc_num) => {
//   console.log(`계획 보기${doc_num}`);
// };
// const getResult = (doc_num) => {
//   console.log(`결과보기 ${doc_num}`);
// };
const moveRegister = () => {
  router.push("/document/write");
};
getList();
</script>
<template>
  <div class="container-fluid py-4">
    <div class="d-flex gap-4 align-items-start">
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
                      버전명
                    </th>

                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      작성일
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      사용시작일
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      사용종료일
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      코멘트
                    </th>
                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      사용중
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(form, index) in list" :key="form.form_ver">
                    <td class="text-center text-sm">
                      {{ list.length - index }}
                    </td>
                    <td class="ps-4 text-sm font-weight-bold">
                      {{ form.form_ver }}
                    </td>
                    <td class="text-center text-sm">
                      {{ formatDate(form.writedate) }}
                    </td>
                    <td class="text-center text-sm">
                      {{ form.begindate }}
                    </td>
                    <td class="text-center">
                      {{ form.enddate }}
                    </td>
                    <td class="text-center">
                      {{ form.comment }}
                    </td>
                    <td class="text-center text-sm">
                      {{ form.usage }}
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
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
// import MaterialInput from "@/components/MaterialInput.vue";

export default {
  name: "tables",
  components: {
    MaterialButton,
    MaterialPagination,
    MaterialPaginationItem,
    // MaterialInput,
  },
};
</script>
