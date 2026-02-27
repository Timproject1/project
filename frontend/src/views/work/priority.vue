<script setup>
import { ref } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { useMemberStore } from "@/store/member";
import axios from "axios";

// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const memberStore = useMemberStore();

const selected = ref(null);
const items = [
  { id: 1, label: "계획", color: "blue", cord: "c3" },
  { id: 2, label: "중점", color: "green", cord: "c4" },
  { id: 3, label: "긴급", color: "red", cord: "c5" },
];
const reason = ref("");
const select = (id) => {
  selected.value = id;
};
const activeStyle = (color) => ({
  backgroundColor: color,
  borderColor: color,
  color: "#fff",
});
const count = ref(0);
const appSign = async () => {
  console.log(selected.value, reason.value);
  if (!selected.value) {
    alert("우선순위를 선택해주세요");
    return;
  } else if (!reason.value) {
    alert("사유를 적어주세요");
    return;
  }
  let appcontent = {
    doc_num: "doc-1",
    priority_reason: reason.value,
    priority: selected.value,
    priority_app_manager: "ca1",
    priority_approved: "d1",
  };
  count.value = 1;
  const result = ref(null);

  try {
    const res = await axios.post(
      "http://localhost:3000/document/priority",
      appcontent,
    );
    console.log(res.data);
    result.value = res.data;
  } catch (err) {
    console.error(err);
    result.value = "서버 에러 발생";
  }
};
const appSigncancel = async () => {
  count.value = 0;
};
</script>
<template>
  <h2>우선순위 관련</h2>
  <div id="rea_container">
    <div id="rea">
      <h3>{{ memberStore.id }}님의 대기단계</h3>
      <div class="wrapper">
        <div
          v-for="item in items"
          :key="item.id"
          class="circle"
          :style="selected === item.cord ? activeStyle(item.color) : {}"
          @click="select(item.cord)"
        >
          {{ item.label }}
        </div>
      </div>
      <br />
      <textarea
        name="reason"
        id="reason"
        placeholder="사유"
        v-model="reason"
      ></textarea>
      <br />
      <div id="btnmargin">
        <p v-if="count == 0">
          <material-button type="button" @click="appSign()"
            >승인 요청</material-button
          >
        </p>
        <p v-else>
          <material-button type="button" disabled>승인 요청 중</material-button>
          <material-button type="button" @click="appSigncancel()" color="danger"
            >승인 취소</material-button
          >
        </p>
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
