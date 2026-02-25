<script setup>
import { useMemberStore } from "@/store/member";
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { useUtilStore } from "../../store/util";
// const utilStore = useUtilStore();
const router = useRouter();
const memberStore = useMemberStore();
import axios from "axios";
const searchQuery = ref({ writer: "", maneger: "", sup: "" });
const list = ref([]);
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
const getDocument = (doc_num) => {
  console.log(`신청서 보기${doc_num}`);
};
const getPlan = (doc_num) => {
  console.log(`계획 보기${doc_num}`);
};
const getResult = (doc_num) => {
  console.log(`결과보기 ${doc_num}`);
};
const moveRegister = () => {
  router.push("/document/write");
};
getList();
</script>
<template>
  <div class="container-fluid py-4">
    <div class="d-flex gap-4 align-items-start">
      <aside
        class="rounded-3 shadow-dark p-3 text-white"
        style="
          min-width: 240px;
          background-color: #344767;
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(doc, index) in list" :key="doc.doc_num">
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
                        @click="getDocument(doc.doc_num)"
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
                        @click="getPlan(doc.doc_num)"
                        >보기</material-button
                      >
                    </td>
                    <td class="text-center">
                      <material-button
                        size="sm"
                        color="dark"
                        variant="outline"
                        class="mb-0 px-3"
                        @click="getResult(doc.doc_num)"
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
