<script setup>
import { ref } from "vue"; // Vue의 반응형 데이터(ref) 기능을 가져옵니다.
import axios from "axios"; // 서버와 HTTP 통신을 하기 위한 axios 라이브러리를 가져옵니다.
import { useRouter } from "vue-router"; // 페이지 이동(라우팅)을 제어하기 위한 도구를 가져옵니다.
import MaterialInput from "@/components/MaterialInput.vue"; // 디자인된 입력창 컴포넌트를 가져옵니다.
import MaterialButton from "@/components/MaterialButton.vue"; // 디자인된 버튼 컴포넌트를 가져옵니다.

const router = useRouter(); // 라우터 인스턴스를 생성하여 페이지 이동 함수를 사용할 준비를 합니다.

// 입력 데이터 및 결과 상태 저장
const userName = ref(""); // 사용자가 입력한 이름을 저장하는 반응형 변수입니다.
const userEmail = ref(""); // 사용자가 입력한 이메일을 저장하는 반응형 변수입니다.
const foundId = ref(""); // 서버로부터 찾은 아이디 결과를 저장하는 변수입니다.
const isSearchDone = ref(false); // 찾기 완료 여부에 따라 화면을 전환하기 위한 상태값입니다.

// 백엔드 API와 통신하여 아이디 찾기 실행 함수
const handleFindId = async () => {
  if (!userName.value || !userEmail.value) {
    // 이름이나 이메일이 입력되지 않았는지 확인합니다.
    alert("이름과 이메일을 입력해주세요."); // 필수 입력 알림창을 띄웁니다.
    return; // 값이 없으면 함수 실행을 중단합니다.
  }
  try {
    // axios를 사용하여 백엔드 서버의 find-id 경로로 데이터를 전송합니다.
    const res = await axios.post("http://localhost:3000/user/find-id", {
      userName: userName.value, // 입력받은 이름을 보냅니다.
      userEmail: userEmail.value, // 입력받은 이메일을 보냅니다.
    });

    if (res.data.success) {
      // 서버가 아이디를 성공적으로 찾았다고 응답한 경우입니다.
      foundId.value = res.data.userId; // 찾은 아이디를 결과 변수에 담습니다.
    } else {
      // 서버에서 일치하는 정보를 찾지 못한 경우입니다.
      foundId.value = "none"; // 결과가 없음을 나타내는 값을 담습니다.
    }
    isSearchDone.value = true; // 결과 화면을 보여주기 위해 상태를 true로 변경합니다.
  } catch (err) {
    // 서버 통신 중 에러가 발생했을 때 처리합니다.
    console.error("아이디 찾기 에러:", err); // 콘솔에 에러 내용을 출력합니다.
    alert("서버 통신 중 오류가 발생했습니다."); // 사용자에게 오류 메시지를 보여줍니다.
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
/* 배경 디자인 */
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

.main-title {
  font-size: 1.85rem !important;
  letter-spacing: -0.05rem;
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
