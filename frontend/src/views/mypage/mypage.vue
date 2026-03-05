<script>
export default {
  data() {
    return {
      isCheck: false,
      passwordConfirm: "",
      userInfo: {
        user_id: "",
      },
    };
  },
  created() {
    // const id = sessionStorage.getItem("user_id");
    // [방어 로직] 세션에 아이디가 없으면 요청을 막고 로그인으로 보냄
    // if (!id || id === "null") {
    //   alert("로그인이 필요합니다.");
    //   this.$router.push("/login");
    //   return;
    // }
    this.userInfo.user_id = "test";
  },

  methods: {
    async checkpassword() {
      // 아이디가 없는 상태로 요청 보내는 것을 원천 차단
      if (!this.userInfo.user_id) return alert("로그인 정보가 없습니다.");
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

          // 페이지 이동 (이미 인증되었으므로 이동된 페이지에서 데이터를 가져옴)
          if (
            this.$route.path === "/mypage" ||
            this.$route.path === "/mypage/"
          ) {
            this.$router.push("/mypage/info");
          }
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("인증오류:", error);
      }
    },
  },
};
</script>

<template>
  <h2>마이페이지</h2>
  <div v-if="!isCheck" class="password-check-box">
    <h3>본인확인</h3>
    <div class="from-group">
      <label>아이디</label>
      <input type="text" v-model="userInfo.user_id" disabled />
    </div>
    <div class="from-group">
      <label>비밀번호</label>
      <input
        type="password"
        v-model="passwordConfirm"
        @keyup.enter="checkpassword"
        placeholder="비밀번호를 입력하세요"
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
