<script setup>
import { ref, onMounted } from "vue";

const user_id = ref("");
const user_pw = ref("");
const user_email = ref("");
const user_tel = ref("");
onMounted(async () => {
  const userId = sessionStorage.getItem("user_id");
  if (userId) {
    user_id.value = userId;
    try {
      const response = await fetch(
        `http://localhost:3000/mypage/info?user_id=${userId}`,
      );
      if (response.ok) {
        const text = await response.text(); // 텍스트로 먼저 받기
        if (text) {
          const data = JSON.parse(text); // 내용이 있을 때만 파싱
          user_email.value = data.user_email || "";
          user_tel.value = data.user_tel || "";
        }
      }
    } catch (error) {
      console.error("조회 에러:", error);
    }
  }
});

const saveInfo = async () => {
  // 아이디가 없으면 저장을 막음
  if (!user_id.value)
    return alert("사용자 정보가 없습니다. 다시 로그인해주세요.");

  try {
    const response = await fetch("http://localhost:3000/mypage/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user_id.value,
        user_password: user_pw.value,
        user_email: user_email.value,
        user_tel: user_tel.value,
      }),
    });

    // 404 에러 시 여기서 걸러짐
    if (response.status === 404) {
      return alert("서버의 업데이트 경로(/mypage/update)를 찾을 수 없습니다.");
    }

    const result = await response.json();
    if (result.success) {
      alert("정보가 수정되었습니다.");
    }
  } catch (error) {
    console.error("저장 오류:", error);
  }
};
</script>

<template>
  <h2>내 정보 수정</h2>
  <div class="info-form">
    <div>
      <label>아이디</label>
      <input type="text" v-model="user_id" disabled />
    </div>
    <div>
      <label>비밀번호</label>
      <input type="password" v-model="user_pw" placeholder="새 비밀번호 입력" />
    </div>
    <div>
      <label>이메일</label>
      <input type="text" v-model="user_email" />
    </div>
    <div>
      <label>전화번호</label>
      <input type="text" v-model="user_tel" />
    </div>
    <button @click="saveInfo">저장</button>
  </div>
</template>
