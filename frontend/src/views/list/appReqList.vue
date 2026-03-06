<script setup>
import { useMemberStore } from "@/store/member";
import { useDocStore } from "../../store/doc";
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const memberStore = useMemberStore();
const docStore = useDocStore();
const currentTab = ref("priority");
const searchQuery = ref({ writer: "", maneger: "", sup: "" });
const list = ref([]);
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
  // 결과: "2026. 2. 22."
};
const getPath = {
  priority: "priReqList",
  plan: "planReqList",
};
const movePath = {
  priority: "priority",
  plan: "plan",
};
const getList = async () => {
  const result = await axios.get(
    `http://localhost:3000/document/${getPath[currentTab.value]}/${
      memberStore.center
    }`,
  );
  list.value = result.data.result;
  console.log(result.data);
  return result;
};

const selectDoc = (doc_num) => {
  // console.log("test");
  console.log(doc_num);
  docStore.doc_num = doc_num;
  router.push(`/work/${movePath[currentTab.value]}`);
};

const fetchTableData = async (tab) => {
  currentTab.value = tab;
  await getList();
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
          <div class="px-3 d-flex gap-2">
            <material-button
              @click="fetchTableData('priority')"
              :active="currentTab == 'priority'"
            >
              우선순위
            </material-button>

            <material-button
              @click="fetchTableData('plan')"
              :active="currentTab == 'plan'"
            >
              지원계획
            </material-button>
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
                      담당자
                    </th>

                    <th
                      class="text-center text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      단계
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="list && list.length > 0">
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

                      <td class="text-center text-sm">
                        {{ doc.manager_name }}
                      </td>

                      <td class="text-center">
                        <span class="badge badge-sm bg-gradient-success">{{
                          doc.progress
                        }}</span>
                      </td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="6" class="text-center py-5">
                      <div class="d-flex flex-column align-items-center">
                        <i
                          class="material-icons text-secondary mb-2"
                          style="font-size: 2rem"
                          >info_outline</i
                        >
                        <p class="text-secondary mb-0">
                          현재 표시할 신청 내역이 없습니다.
                        </p>
                      </div>
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
