<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onMounted, onBeforeMount } from "vue";
import { useMemberStore } from "@/store/member";
import axios from "axios";

import { useRoute } from "vue-router";
const route = useRoute();

const memberStore = useMemberStore();

let prioritydb = ref({});

const priorityData = async (id) => {
  let result = await axios
    .get(`user/priority/${id}`)
    .catch((err) => console.log(err));
  prioritydb.value = result.value;
};
onBeforeMount(() => {
  let searchId = route.query.no;
  priorityData(searchId);
});

const items = [
  { id: 1, label: "계획", color: "blue", cord: "c3" },
  { id: 2, label: "중점", color: "green", cord: "c4" },
  { id: 3, label: "긴급", color: "red", cord: "c5" },
];

const box = ref(null);

onMounted(() => {});

const display = () => {
  if (box.value) {
    box.value.style.display = "block";
  }
};
const nonedisplay = () => {
  if (box.value) {
    box.value.style.display = "none";
  }
};
</script>
<template>
  <div id="rea_container">
    <div id="rea">
      <h3>{{ memberStore.id }}님의 대기단계</h3>
      <div class="wrapper" v-if="prioritydb.priority == 'c3'">
        <div
          class="circle"
          :style="{ backgroundColor: items[0].color, color: '#fff' }"
          disabled
        >
          {{ items[0].label }}
        </div>
      </div>
      <div class="wrapper" v-else-if="prioritydb.priority == 'c4'">
        <div
          class="circle"
          :style="{ backgroundColor: items[1].color, color: '#fff' }"
          disabled
        >
          {{ items[1].label }}
        </div>
      </div>
      <div class="wrapper" v-else>
        <div
          class="circle"
          :style="{ backgroundColor: items[2].color, color: '#fff' }"
          disabled
        >
          {{ items[2].label }}
        </div>
      </div>
      <br />
      <div id="reasonbox">
        <p>{{ prioritydb.priority_reason }}</p>
        <div class="return" ref="box">
          <h5>반려 사유</h5>
          <textarea
            name="return"
            id="return"
            placeholder="반려사유작성"
          ></textarea>
          <br />
          <material-button type="button" class="app">반려</material-button>
          <material-button
            type="button"
            class="app"
            @click="nonedisplay()"
            color="danger"
            >취소</material-button
          >
        </div>
      </div>
      <br />
      <div id="btnmargin">
        <material-button type="button" class="app">승인</material-button>
        <material-button
          type="button"
          class="app"
          @click="display()"
          color="danger"
          >반려</material-button
        >
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
  margin: 5px auto;
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
.return {
  display: none;
  text-align: center;
  background-color: white;
  padding: 5px;
  border: 1px solid black;
  width: 70%;
  text-align: center;
  margin: 0 auto;
}
#return {
  margin: 0 auto;
  width: 100%;
  height: 150px;
  vertical-align: top;
  resize: none;
  border: 1px solid black;
}
.app {
  margin: 10px;
  width: 25%;
  height: 50px;
}
#btnmargin {
  margin: 10px;
}
#reasonbox {
  margin: 0 auto;
  vertical-align: top;
  color: black;
  text-align: left;
}
p {
  margin: 0 auto;
  width: 75%;
  height: 200px;
  font-size: 18px;
  border: 1px solid black;
  background-color: white;
}
</style>
