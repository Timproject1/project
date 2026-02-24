<script setup></script>
<template>
  <div class="container-fluid py-4">
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
                        >지원계획서보기</material-button
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
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Table -->
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
export default {
  name: "tables",
  components: { MaterialButton, MaterialPagination, MaterialPaginationItem },
};
</script>
