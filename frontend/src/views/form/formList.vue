<script setup>
// import { useMemberStore } from "@/store/member";
import { ref, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
// const memberStore = useMemberStore();
// const searchQuery = ref({ writer: "", maneger: "", sup: "" });
const list = ref([]);
const totalCount = ref(0); // 전체 데이터 개수
const currentPage = ref(1); // 현재 페이지
const perPage = 10; // 페이지당 항목 수
const totalPages = ref(0); // 전체 페이지 수

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
  // 결과: "2026. 2. 22."
};

const displayedPages = computed(() => {
  const range = 2; // 현재 페이지 앞뒤로 보여줄 개수
  let start = Math.max(1, currentPage.value - range);
  let end = Math.min(totalPages.value, currentPage.value + range);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await getCount();
  await getList(); // 페이지 바뀔 때마다 다시 호출
};
const getList = async () => {
  const result = await axios.get("http://localhost:3000/form/list", {
    params: {
      page: currentPage.value,
      limit: perPage,
    },
  });
  console.log(result.data);
  list.value = result.data.result;
  console.log(list.value);
};
const getCount = async () => {
  const result = await axios.get("http://localhost:3000/form/count");
  console.log(result.data);
  totalCount.value = result.data.count;
  console.log(totalCount.value);
  totalPages.value = Math.ceil(Number(totalCount.value) / perPage);
};
const getForm = (form_ver) => {
  router.push(`/form/view/${form_ver}`);
};

const moveRegister = () => {
  router.push(`/form/write`);
};
onBeforeMount(async () => {
  await getCount();
  await getList();
});
</script>
<template>
  <div class="container-fluid py-4">
    <div class="d-flex gap-4 align-items-start">
      <main class="flex-grow-1">
        <div class="card shadow-sm">
          <div class="card-header p-3">
            <h6 class="mb-0 font-weight-bolder">양식 목록</h6>
          </div>

          <div class="card-body px-0 pb-2">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr class="bg-gray-100">
                    <th
                      class="ps-4 text-secondary text-xxs font-weight-bolder opacity-7"
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
                  <tr
                    v-for="(form, idx) in list"
                    :key="form.form_ver"
                    @click="getForm(form.form_ver)"
                  >
                    <td class="ps-4 text-sm font-weight-bold">
                      {{ totalCount - (idx + (currentPage - 1) * perPage) }}
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
              <material-pagination color="success" size="sm">
                <material-pagination-item
                  prev
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                />

                <material-pagination-item
                  v-for="page in displayedPages"
                  :key="page"
                  :label="page"
                  :active="currentPage === page"
                  @click="changePage(page)"
                />

                <material-pagination-item
                  next
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                />
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
