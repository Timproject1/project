<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
              class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3"
            >
              <h3 class="text-white text-capitalize ps-3 text-center">
                홈페이지 창
              </h3>
            </div>
          </div>

          <div class="card-body px-0 pb-2">
            <div class="p-5 text-center">
              <h1 class="display-1 font-weight-bold text-success mb-4">
                홈페이지 창
              </h1>
              <hr class="horizontal dark" />
              <h4 class="mt-4" v-if="userName">
                <span class="text-success">{{ userName }}</span
                >님, 환영합니다!
              </h4>
              <p class="text-secondary">성공적으로 연결되었습니다. <br /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const userName = ref("");

onMounted(() => {
  userName.value = localStorage.getItem("userName") || "사용자";
});
</script>

<style scoped>
.display-1 {
  font-size: 5rem;
  font-weight: 800;
}
.card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
