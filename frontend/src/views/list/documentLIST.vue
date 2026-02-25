<script setup>
import { useMemberStore } from "@/store/member";
import { ref } from "vue";
const memberStore = useMemberStore();
import axios from "axios";
console.log(memberStore.id);
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
getList();
</script>
<template>
  <div class="container-fluid py-4">
    <section class="bg-white p-4 rounded shadow-sm mb-6">
      <div class="grid grid-cols-4 gap-4 items-end">
        <div>
          <material-input
            id="sup"
            type="text"
            label="지원자명"
            name="address"
            size="sm"
            v-model="searchQuery.sup"
          />
        </div>
        <div>
          <material-input
            id="writer"
            type="text"
            label="작성자명"
            name="address"
            size="sm"
            v-model="searchQuery.writer"
          />
        </div>
        <div>
          <material-input
            id="maneger"
            type="text"
            label="담당자명"
            name="address"
            size="sm"
            v-model="searchQuery.maneger"
          />
        </div>
        <div class="flex gap-2">
          <material-button
            variant="outline"
            color="success"
            size="sm"
            @click="getList()"
            >검색</material-button
          >
        </div>
      </div>
    </section>
    <!-- Authors Table -->
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header">
            <h6>지원신청서 목록</h6>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th>넘버</th>
                    <th>지원자명</th>
                    <th class="text-center">보호자명</th>
                    <th class="text-center">지원신청일</th>
                    <th>지원신청서</th>
                    <th>담당자</th>
                    <th>지원계획</th>
                    <th>지원결과</th>
                    <th>대기단계</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in list" :key="doc.doc_num">
                    <td class="text-center">{{ doc.doc_num }}</td>
                    <td class="text-center">{{ doc.sup_name }}</td>
                    <td class="text-center">{{ doc.writer_name }}</td>
                    <td class="text-center">
                      {{ formatDate(doc.write_date) }}
                    </td>
                    <td class="text-center">
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        @click="getDocument(doc.doc_num)"
                        >신청서보기</material-button
                      >
                    </td>
                    <td class="text-center">{{ doc.manager_name }}</td>
                    <td class="text-center">
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        @click="getPlan(doc.doc_num)"
                        >지원계획서보기</material-button
                      >
                    </td>
                    <td class="text-center">
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        @click="getResult(doc.doc_num)"
                        >지원결과보기</material-button
                      >
                    </td>
                    <td class="text-center">{{ doc.progress }}</td>
                  </tr>
                  <tr>
                    <td>John Michael</td>
                    <td>Manager</td>
                    <td class="text-center">Online</td>
                    <td class="text-center">23/04/18</td>
                    <td>
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        >신청서보기</material-button
                      >
                    </td>
                    <td>미정</td>
                    <td>
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        >지원계획보기</material-button
                      >
                    </td>
                    <td>
                      <material-button
                        variant="outline"
                        color="success"
                        size="sm"
                        class="mt-2"
                        >지원결과보기</material-button
                      >
                    </td>
                    <td>대기</td>
                  </tr>

                  <!-- 필요한 만큼 반복 -->
                </tbody>
              </table>
            </div>
            <material-pagination>
              <material-pagination-item prev />
              <material-pagination-item label="1" active />
              <material-pagination-item label="2" disabled />
              <material-pagination-item label="3" />
              <material-pagination-item next />
            </material-pagination>
            <material-button
              variant="outline"
              color="success"
              size="sm"
              class="mt-2"
              @click="getResult(doc.doc_num)"
              >신청서작성</material-button
            >
          </div>
        </div>
      </div>
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
