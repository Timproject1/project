<script>
export default {
  data() {
    return {
      isCheck: false,
      passwordConfirm: "",
      // 본인 정보 수정 시 입력하는 부분
      userInfo: {
        user_id: "", // 프라이머리키라서 입력하지 못하게 비활성화 해야함
        user_password: "",
        user_name: "",
        user_email: "",
        user_tel: "",
      },
    };
  },
  // 공통: 마이페이지 접속 시 비밀번호 확인부분
  methods: {
    async checkpassword() {
      // try {
      //   const response = await fetch("http://localhost:3000/mypage/check", {
      //     method: "post",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       user_id: this.userInfo.user_id,
      //       password: this.passwordConfirm,
      //     }),
      //   });
      //   if (response.ok) {
      //     alert("본인 확인 완료");
      //     this.isCheck = true;
      //     this.getUserInfo();
      //   } else {
      //     alert("비밀번호가 일치하지 않습니다 다시 입력해주세요");
      //   }
      // } catch (error) {
      //   console.error("인증오류:", error);
      // }
      alert("테스트 중입니다");
      this.isCheck = true;
      this.getUserInfo();
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
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    },
    async updatedInfo() {
      if (confirm("수정을 완료하시겠습니까?")) {
        try {
          const response = await fetch("http://localhost:3000/mypage/update", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.userInfo),
          });
          const result = await response.json();
          if (response.ok && result.success) {
            alert("수정완료");
          } else {
            alert("수정 실패:" + (result.message || "알수없는 오류 발생"));
          }
        } catch (error) {
          console.error("수정 중 통신에러:", error);
          alert("서버와 통신 중 오류 발생");
        }
      }
    },
  },
};
</script>
<template>
  <h2>마이페이지</h2>
  <!-- 첫 접속시 본인확인 화면 -->
  <div v-if="!isCheck" class="password-check-box">
    <p>본인 확인을 위해 비밀번호를 한번 더 입력해주세요</p>
    <div class="from-group">
      <label>아이디</label>
      <input type="text" v-model="userInfo.user_id" disabled />
    </div>
    <div class="from-group">
      <label>비밀번호</label>
      <input type="password" v-model="passwordConfirm" @keyup="checkpassword" />
    </div>
    <button class="btn-confirm" @click="checkpassword">확인</button>
  </div>
  <!-- 내 정보 수정화면 -->
  <div v-else class="edit-section">
    <div class="info-from">
      <h3>내정보 수정</h3>
    </div>
    <div class="from-group">
      <label>아이디</label>
      <input
        type="text"
        v-model="userInfo.user_id"
        disabled
        class="disable-input"
      />
    </div>
    <div class="from-group">
      <label>비밀번호 변경</label>
      <input type="password" v-model="userInfo.user_password" />
    </div>
    <div class="from-group">
      <label>이메일</label>
      <input type="email" v-model="userInfo.user_email" />
    </div>
    <div class="from-group">
      <label>휴대폰번호</label>
      <input type="tel" v-model="userInfo.user_tel" />
    </div>
    <button @click="updatedInfo">저장하기</button>
  </div>
</template>
