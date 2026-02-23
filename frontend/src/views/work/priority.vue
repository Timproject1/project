<script setup>
import { ref } from "vue";
const selected = ref(null);

const items = [
  { id: 1, label: "계획", color: "blue" },
  { id: 2, label: "중점", color: "green" },
  { id: 3, label: "긴급", color: "red" },
];
const name = ref("홍길동");
const select = (id) => {
  selected.value = id;
};
const activeStyle = (color) => ({
  backgroundColor: color,
  borderColor: color,
  color: "#fff",
});
</script>
<template>
  <h2>우선순위 관련</h2>
  <div id="rea_container">
    <div id="rea">
      <h3>{{ name }}님의 대기단계</h3>
      <div class="wrapper">
        <div
          v-for="item in items"
          :key="item.id"
          class="circle"
          :style="selected === item.id ? activeStyle(item.color) : {}"
          @click="select(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
      <br />
      <textarea name="reason" id="reason" placeholder="사유"></textarea>
      <br />
      <div id="btnmargin">
        <button type="button" class="app">승인 요청</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  gap: 20px;
}

.circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  font-weight: bold;
  transition: all 0.3s ease;
  margin: 0 auto;
}

h3 {
  text-align: center;
}
#rea_container {
  border: 1px solid black;
  padding: 10px;
  margin: 0 auto;
  background-color: bisque;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
}
#rea {
  border: 1px solid black;
  padding: 10px;
  background-color: beige;
  margin: 0 auto;
  text-align: center;
}
#reason {
  margin: 0 auto;
  width: 75%;
  height: 200px;
  vertical-align: top;
  resize: none;
}
.app {
  margin: 0 auto;
  width: 50%;
  height: 50px;
  background-color: rgb(103, 147, 241);
}
#btnmargin {
  margin: 10px;
}
</style>
