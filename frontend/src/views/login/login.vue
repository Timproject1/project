<script setup>
import { ref } from "vue";
const id = ref("");
const password = ref("");
const login = async function () {
  const member = { id: id.value, password: password.value };
  const result = await fetch(`http://localhost:3000/user/login`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(member),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
    });
  console.log(result);
};
</script>

<template>
  <h2>로그인페이지 작업</h2>
  <form>
    id:<input type="text" name="id" v-model="id" /><br />
    password:<input type="password" name="password" v-model="password" />
    <br />
    <button type="button" @click="login">로그인</button>
    <button type="reset">취소</button>
  </form>
</template>
