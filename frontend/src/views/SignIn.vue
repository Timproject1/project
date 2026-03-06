<script setup>
/* eslint-disable */
import { ref, onBeforeMount, onBeforeUnmount } from "vue"; // Vue에서 상태 관리와 생명주기 훅을 가져옵니다.
import { useStore } from "vuex"; // 기존의 Vuex 상태 관리를 사용하기 위해 가져옵니다.
import { useRouter } from "vue-router"; // 다른 페이지로 이동하기 위한 라우터 도구를 가져옵니다.
import axios from "axios"; // 서버와 데이터를 주고받기 위한 통신 라이브러리를 가져옵니다.
import Navbar from "@/examples/PageLayout/Navbar.vue"; // 상단 네비게이션 바 컴포넌트를 가져옵니다.
import MaterialInput from "@/components/MaterialInput.vue"; // 디자인된 입력창 컴포넌트를 가져옵니다.
import MaterialButton from "@/components/MaterialButton.vue"; // 디자인된 버튼 컴포넌트를 가져옵니다.

// Pinia 스토어를 가져옵니다. (이미지 경로인 @/store/member로 맞춤)
import { useMemberStore } from "@/store/member";

// 배경 이미지 파일을 가져옵니다.
import bgImage from "@/assets/img2.png";

const store = useStore(); // Vuex 저장소 인스턴스를 사용 가능하게 만듭니다.
const router = useRouter(); // 라우터 인스턴스를 생성하여 이동 함수를 준비합니다.
const memberStore = useMemberStore(); // Pinia 스토어 인스턴스를 생성합니다.

const userId = ref(""); // 사용자가 입력창에 쓴 아이디를 담는 변수입니다.
const password = ref(""); // 사용자가 입력창에 쓴 비밀번호를 담는 변수입니다.
const loginError = ref(false); // 로그인 실패 시 화면에 경고를 띄울지 결정하는 상태값입니다.

// 실제 로그인을 처리하는 함수입니다.
const handleLogin = async () => {
  if (!userId.value || !password.value) {
    // 아이디나 비밀번호가 비어있는지 확인합니다.
    loginError.value = true; // 에러 상태를 참으로 만듭니다.
    alert("아이디와 비밀번호를 모두 입력해주세요."); // 알림창을 띄웁니다.
    return; // 더 이상 진행하지 않고 중단합니다.
  }

  try {
    // 서버의 로그인 API 주소로 사용자가 입력한 정보를 보냅니다.
    const response = await axios.post("http://localhost:3000/user/login", {
      user_id: userId.value, // 입력한 아이디입니다.
      user_password: password.value, // 입력한 비밀번호입니다.
    });

    if (response.data && response.data.success) {
      // 서버 응답이 성공(success)일 때 실행합니다.
      loginError.value = false; // 에러 상태를 끕니다.
      alert(`환영합니다, ${response.data.user.user_name}님!`); // 환영 메시지를 띄웁니다.

      // Pinia 스토어에 사용자 정보를 저장합니다.
      memberStore.setMember({
        id: response.data.user.user_id,
        center: response.data.user.center || "1018112345",
        grade: response.data.user.grade,
        name: response.data.user.user_name,
      });

      router.push({ name: "Home" }); // 메인 페이지(Home)로 화면을 이동시킵니다.
    } else {
      // 아이디나 비번이 틀려서 서버가 실패 응답을 보낸 경우입니다.
      loginError.value = true; // 에러 상태를 켭니다.
      alert("아이디 또는 비밀번호가 틀렸습니다."); // 실패 알림을 줍니다.
    }
  } catch (error) {
    // 네트워크 오류 등 예외가 발생했을 때 처리합니다.
    console.error("로그인 에러:", error); // 개발자 도구 콘솔에 에러를 기록합니다.
    loginError.value = true; // 에러 상태를 켭니다.

    if (error.response && error.response.status === 404) {
      // 서버 주소가 잘못되었을때 입니다.
      alert("서버의 로그인 경로를 찾을 수 없습니다.");
    } else {
      // 그 외 서버와 연결할 수 없을 때입니다.
      alert("서버 연결에 실패했습니다.");
    }
  }
};

// 화면이 그려지기 전에 실행하여 특정 UI 요소들을 숨기거나 조절합니다.
onBeforeMount(() => {
  store.commit("toggleEveryDisplay"); // 페이지별 커스텀 레이아웃 설정을 켭니다.
  store.commit("toggleHideConfig"); // 설정 버튼 등을 화면에서 숨깁니다.
});

// 이 화면을 떠날 때 원래의 화면 설정으로 복구합니다.
onBeforeUnmount(() => {
  store.commit("toggleEveryDisplay"); // 변경했던 레이아웃 설정을 복원합니다.
  store.commit("toggleHideConfig"); // 숨겼던 설정 버튼을 다시 보여줍니다.
});
</script>

<template>
  <navbar btnBackground="bg-gradient-success" />
  <div
    class="page-header align-items-start min-vh-100"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div
      class="container d-flex justify-content-center align-items-center min-vh-100"
    >
      <div class="login-card-box">
        <div class="header-bar bg-gradient-success shadow-success">
          <h4 class="text-white font-weight-bolder mb-0 text-center">
            발달장애인 지원 프로그램
          </h4>
        </div>
        <div class="login-content">
          <div class="error-msg-area">
            <p v-if="loginError" class="text-danger text-sm text-center">
              * 입력된 정보를 확인해주십시오.
            </p>
          </div>
          <form role="form" @submit.prevent="handleLogin">
            <div class="row-input mb-4">
              <label class="row-label" for="id">아이디</label>
              <material-input id="id" v-model="userId" class="row-field" />
            </div>
            <div class="row-input mb-5">
              <label class="row-label" for="password">비밀번호</label>
              <material-input
                id="password"
                type="password"
                v-model="password"
                class="row-field"
              />
            </div>

            <material-button
              class="action-btn mb-3"
              variant="gradient"
              color="success"
              fullWidth
              size="lg"
              type="submit"
              >로 그 인</material-button
            >

            <router-link :to="{ name: 'SignUp' }">
              <material-button
                class="action-btn mb-3"
                variant="gradient"
                color="success"
                fullWidth
                size="lg"
                type="button"
                >회 원 가 입</material-button
              >
            </router-link>

            <div class="find-options mt-3 text-center">
              <router-link to="/find-id" class="find-link"
                >아이디 찾기</router-link
              >
              <span class="divider">|</span>
              <router-link to="/find-pw" class="find-link"
                >비밀번호 찾기</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 로그인 카드 상자의 전체적인 모양과 그림자 설정입니다. */
.login-card-box {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 5;
}
/* 카드의 제목이 적힌 상단 바의 위치와 색상입니다. */
.header-bar {
  margin: -25px 20px 0 20px;
  padding: 20px 0;
  border-radius: 10px;
}
/* 카드 본문의 내부 여백입니다. */
.login-content {
  padding: 40px 40px 30px 40px;
}
/* 라벨과 입력 필드를 가로로 정렬합니다. */
.row-input {
  display: flex;
  align-items: center;
}
/* 라벨의 너비와 굵기 스타일입니다. */
.row-label {
  width: 100px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #344767;
}
/* 입력창이 남은 공간을 모두 차지하도록 만듭니다. */
.row-field {
  flex: 1;
}
/* 버튼의 굵은 폰트와 자간 설정입니다. */
.action-btn {
  font-size: 1.1rem !important;
  font-weight: bold !important;
  letter-spacing: 5px;
  border-radius: 10px !important;
}
/* 에러 메시지 공간의 고정 높이를 설정합니다. */
.error-msg-area {
  height: 25px;
  margin-bottom: 10px;
}

/* 하단 찾기 링크들의 배치와 테두리입니다. */
.find-options {
  border-top: 1px solid #f0f2f5;
  padding-top: 15px;
}
/* 링크 글자의 색상과 부드러운 전환 효과입니다. */
.find-link {
  font-size: 0.9rem;
  color: #7b809a;
  text-decoration: none;
  transition: color 0.2s ease;
}
/* 마우스를 올렸을 때 초록색으로 변합니다. */
.find-link:hover {
  color: #4caf50;
}
/* 아이디/비밀번호 찾기 사이의 구분선 간격입니다. */
.divider {
  margin: 0 15px;
  color: #d2d6da;
}
</style>
