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
  priority: "priority_manager",
  plan: "plan_manager",
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
            <div class="px-3 pt-2 d-flex gap-2 mb-2">
              <button
                type="button"
                class="btn btn-sm"
                :class="
                  currentTab === 'priority'
                    ? 'bg-gradient-success text-white'
                    : 'btn-outline-secondary'
                "
                @click="fetchTableData('priority')"
              >
                우선순위
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="
                  currentTab === 'plan'
                    ? 'bg-gradient-success text-white'
                    : 'btn-outline-secondary'
                "
                @click="fetchTableData('plan')"
              >
                지원계획
              </button>
            </div>
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
              class="bottom-actions d-flex justify-content-between align-items-center p-3 mt-2"
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
      </div>
    </div>
  </div>
</template>
<script>

import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialInput from "@/components/MaterialInput.vue";

export default {
  name: "tables",
  components: {
    MaterialPagination,
    MaterialPaginationItem,
    MaterialInput,
  },
};
</script>
<style scoped>
/* documentLIST.vue 동일 레이아웃 */
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
</style>
