<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMemberStore } from "@/store/member";

// 1. 변수 및 라이브러리 초기화
const router = useRouter();
const route = useRoute();
const memberStore = useMemberStore();

// 2. Data (Reactive States)
const isCheck = ref(false);
const passwordConfirm = ref("");
const userInfo = reactive({
  user_id: "",
});

// 3. Lifecycle (Created/Mounted 역할)
// script setup 자체가 created 시점과 유사하게 작동합니다.
console.log("현재 로그인 아이디:", memberStore.id);
userInfo.user_id = memberStore.id || "test";

// 4. Methods
const checkpassword = async () => {
  // 아이디가 없는 상태로 요청 보내는 것을 원천 차단
  // if (!memberStore.id) return alert("로그인 정보가 없습니다.");

  if (!passwordConfirm.value) {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/mypage/check", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        password: passwordConfirm.value,
      }),
    });

    if (response.ok) {
      alert("본인 확인 완료");
      isCheck.value = true;

      // 페이지 이동 logic
      if (route.path === "/mypage" || route.path === "/mypage/") {
        router.push("/mypage/info");
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    console.error("인증오류:", error);
  }
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
