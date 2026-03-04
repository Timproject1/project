<script>
export default {
  data() {
    return {
      isCheck: false,
      passwordConfirm: "",
      // 본인 정보 수정 시 입력하는 부분
      userInfo: {
        user_id: "", // 프라이머리키라서 입력하지 못하게 비활성화 해야함
      },
    };
  },
  created() {
    const id = sessionStorage.getItem("user_id");
    if (id) {
      this.userInfo.user_id = id;
    }
  },

  // 공통: 마이페이지 접속 시 비밀번호 확인부분
  methods: {
    async checkpassword() {
      if (!this.passwordConfirm) return alert("비밀번호를 입력해주세요.");

      try {
        const response = await fetch("http://localhost:3000/mypage/check", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: this.userInfo.user_id,
            password: this.passwordConfirm,
          }),
        });

        if (response.ok) {
          alert("본인 확인 완료");
          this.isCheck = true;

          // [추가] 본인 확인 후 기본적으로 '내 정보 수정' 페이지가 보이도록 이동
          // 만약 현재 경로가 /mypage 라면 /mypage/info로 보냅니다.
          if (
            this.$route.path === "/mypage" ||
            this.$route.path === "/mypage/"
          ) {
            this.$router.push("/mypage/info");
          }

          this.getUserInfo();
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("인증오류:", error);
      }
    },
    async getUserInfo() {
      try {
        const id = sessionStorage.getItem("user_id");
        const response = await fetch(
          `http://localhost:3000/mypage/info?user_id=${id}`,
        );
        if (response.ok) {
          const data = await response.json();
          this.userInfo = { ...this.userInfo, ...data };
        } else {
          console.error("서버에서 정보 가져오기 실패");
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    },
  },
};
</script>
<template>
  <h2>마이페이지</h2>
  <!-- 첫 접속시 본인확인 화면 -->
  <div v-if="!isCheck" class="password-check-box">
    <h3>본인확인</h3>
    <p>본인 확인을 위해 비밀번호를 한번 더 입력해주세요</p>
    <div class="from-group">
      <label>아이디</label>
      <input type="text" v-model="userInfo.user_id" />
    </div>
    <div class="from-group">
      <label>비밀번호</label>
      <input
        type="password"
        v-model="passwordConfirm"
        @keyup.enter="checkpassword"
      />
    </div>
    <button class="btn-confirm" @click="checkpassword">확인</button>
  </div>
  <div v-else class="mypage-content">
    <nav class="mypage-menu">
      <router-link to="/mypage/info">내 정보 수정</router-link>
      <router-link to="/mypage/supported">지원 목록</router-link>
    </nav>
    <hr />
    <router-view />
  </div>
</template>
