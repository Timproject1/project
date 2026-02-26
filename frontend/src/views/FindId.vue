<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

const router = useRouter();

const userName = ref("");
const userEmail = ref("");
const foundId = ref("");
const isSearchDone = ref(false);

const handleFindId = async () => {
  if (!userName.value || !userEmail.value) {
    alert("이름과 이메일을 입력해주세요.");
    return;
  }
  try {
    const res = await axios.post("http://localhost:3000/user/find-id", {
      userName: userName.value,
      userEmail: userEmail.value,
    });

    if (res.data.success) {
      foundId.value = res.data.userId;
    } else {
      foundId.value = "none";
    }
    isSearchDone.value = true;
  } catch (err) {
    console.error("아이디 찾기 에러:", err);
    alert("서버 통신 중 오류가 발생했습니다.");
  }
};
</script>

<template>
  <div class="page-header min-vh-100 find-id-bg">
    <div
      class="container d-flex justify-content-center align-items-center min-vh-100"
    >
      <div class="find-id-card shadow-xl overflow-hidden">
        <div class="card-header-custom text-center py-4 bg-gradient-success">
          <h2 class="text-white mb-0 font-weight-bolder main-title">
            아이디 찾기
          </h2>
        </div>

        <div class="card-body p-5">
          <div v-if="!isSearchDone">
            <div class="mb-4">
              <label class="form-label-custom">성함</label>
              <material-input
                v-model="userName"
                placeholder="등록된 이름을 입력하세요"
                class="custom-input"
              />
            </div>
            <div class="mb-5">
              <label class="form-label-custom">이메일 주소</label>
              <material-input
                v-model="userEmail"
                type="email"
                placeholder="example@mail.com"
                class="custom-input"
              />
            </div>
            <div class="d-grid gap-3">
              <material-button
                variant="gradient"
                color="success"
                fullWidth
                size="lg"
                class="action-btn-main"
                @click="handleFindId"
                >아이디 찾기</material-button
              >
              <material-button
                variant="text"
                color="secondary"
                fullWidth
                @click="router.push({ name: 'SignIn' })"
                >이전 화면으로 돌아가기</material-button
              >
            </div>
          </div>

          <div v-else class="text-center">
            <div class="result-status-icon mb-4">
              <i v-if="foundId !== 'none'" class="material-icons text-success"
                >check_circle</i
              >
              <i v-else class="material-icons text-warning">error_outline</i>
            </div>

            <div class="result-display-box mb-5">
              <div v-if="foundId !== 'none'">
                <p class="text-secondary mb-1">요청하신 아이디 정보입니다.</p>
                <h2 class="found-id-text">{{ foundId }}</h2>
              </div>
              <div v-else>
                <h5 class="text-dark font-weight-bold">
                  일치하는 정보가 없습니다.
                </h5>
                <p class="text-sm text-secondary">
                  입력하신 이름과 이메일을 다시 확인해 주세요.
                </p>
              </div>
            </div>

            <div class="row g-2">
              <div class="col-6">
                <material-button
                  variant="gradient"
                  color="success"
                  fullWidth
                  @click="router.push({ name: 'SignIn' })"
                  >로그인하기</material-button
                >
              </div>
              <div class="col-6">
                <material-button
                  variant="outline"
                  color="success"
                  fullWidth
                  @click="router.push({ name: 'FindPw' })"
                  >비밀번호 찾기</material-button
                >
              </div>
            </div>
            <p v-if="foundId === 'none'" class="mt-4 text-sm">
              아직 회원이 아니신가요?
              <router-link
                :to="{ name: 'SignUp' }"
                class="text-success font-weight-bold"
                >회원가입</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 배경 설정 */
.find-id-bg {
  background-image: linear-gradient(195deg, #f0f2f5 0%, #e0e0e0 100%);
}

.find-id-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 1rem;
  border: none;
}

.card-header-custom {
  margin: -20px 20px 0 20px;
  border-radius: 0.75rem;
  box-shadow:
    0 4px 20px 0 rgba(0, 0, 0, 0.14),
    0 7px 10px -5px rgba(76, 175, 80, 0.4);
}

/* ★ 한국어 제목 스타일: 크기 키움 */
.main-title {
  font-size: 1.85rem !important; /* 글자 크기 확대 */
  letter-spacing: -0.05rem; /* 자간 조절로 가독성 향상 */
}

.form-label-custom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #344767;
  margin-left: 0.25rem;
  margin-bottom: 0.5rem;
  display: block;
}

.result-display-box {
  background-color: #f8f9fa;
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  border: 1px dashed #d2d6da;
}

.found-id-text {
  color: #2e7d32;
  font-weight: 800;
  letter-spacing: -1px;
  margin-top: 0.5rem;
}

.material-icons {
  font-size: 4rem;
}

.action-btn-main {
  box-shadow:
    0 4px 6px rgba(50, 50, 93, 0.11),
    0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
