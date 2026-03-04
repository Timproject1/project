<script setup>
import { ref, onMounted } from "vue";

const isOpen = ref(true);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const user_id = ref("");
const user_pw = ref("");
const user_email = ref("");
const user_address = ref("");

onMounted(() => {
  const userId = sessionStorage.getItem("user_id");
  if (userId) {
    user_id.value = userId;
    user_email.value = "user01@test.email.com";
    user_address.value = "서울특별시 강남구 00동";
  }
});
const saveInfo = () => {
  if (!user_pw.value) {
    return alert("빠짐없이 입력 해주세요");
  }
  alert("저장 성공");
  console.log({
    id: user_id.value,
    pw: user_pw.value,
    email: user_email.value,
    addr: user_address.value,
  });
};
</script>
<template>
  <h2>내 정보 수정</h2>
  <div class="layout-wrapper">
    <aside class="sidebar-container">
      <div class="management-box">
        <div class="box-header" @click="toggleMenu">
          마이페이지 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
        </div>
        <ul v-if="isOpen" class="menu-list">
          <li>내 정보</li>
        </ul>
      </div>
    </aside>
  </div>
  <div>
    <label>아이디</label>
    <input type="text" v-model="user_id" disabled />
  </div>
  <div>
    <label>비밀번호</label>
    <input type="text" v-model="user_pw" />
  </div>
  <div>
    <label>이메일</label>
    <input type="text" v-model="user_email" />
  </div>
  <div>
    <label>주소</label>
    <input type="text" v-model="user_address" />
    <button>우편번호 검색</button>
  </div>
  <button @click="saveInfo">저장</button>
</template>
