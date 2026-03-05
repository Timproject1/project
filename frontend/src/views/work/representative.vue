<script setup>
import axios from "axios";
import { ref, onBeforeMount } from "vue";
import { useDocStore } from "../../store/doc";
const managers = ref(["정찬우", "장수연", "이민호", "안형주", "김진환"]);
const selectedManager = ref("");
const docStore = useDocStore();

const handleRegister = async () => {
  if (!selectedManager.value) {
    alert("담당자를 먼저 선택해주세요.");
    return;
  }
  const result = await axios.patch(
    `http://localhost:3000/document/manager/${docStore.doc_num}/${selectedManager.value}`,
  );
  if (result.data.retCode == "OK") {
    alert(`${selectedManager.value} 담당자로 등록되었습니다.`);
  } else {
    alert("오류발생 관리자에게 문의해주세요");
  }
};
//작성자의 센터의 기관담당자 또는 관리자 가져오기
const getManagerList = async () => {
  console.log(docStore.writer);
  const result = await axios.get(
    `http://localhost:3000/user/getManager/${docStore.writer}`,
  );
  managers.value = result.data.result;
};
const getManager = async () => {
  const result = await axios.get(
    `http://localhost:3000/document/manager/${docStore.doc_num}`,
  );
  console.log(result.data);
  selectedManager.value = result.data.result.manager || "";
};
const handleCancel = () => {
  selectedManager.value = "";
};
onBeforeMount(async () => {
  await getManagerList();
  await getManager();
});
</script>
<template>
  <div class="admin-panel">
    <div class="sentence-area">
      <span class="text-label"> 담당자는 </span>

      <div class="select-container">
        <select v-model="selectedManager" class="standard-select">
          <option value="" disabled selected>담당자를 선택하세요</option>
          <option
            v-for="manager in managers"
            :key="manager.user_id"
            :value="manager.user_id"
          >
            {{ manager.user_name }}
          </option>
        </select>
        <!-- <div class="arrow-indicator">▼</div> -->
      </div>

      <span class="text-label">입니다.</span>
    </div>

    <div class="button-area">
      <button class="action-btn" @click="handleRegister">등 록</button>
      <button class="action-btn" @click="handleCancel">취 소</button>
    </div>
  </div>
</template>

<style scoped>
/* 전체 패널 (화면 우측 절반 수준의 부피감) */
.admin-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* min-height: 400px; 부피감을 위해 최소 높이 설정 */
  gap: 50px; /* 문장과 버튼 사이 간격 */
  background-color: #ffffff;
}

/* 문장 가로 배치 */
.sentence-area {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: nowrap;
}

.text-label {
  font-size: 24px;
  color: #333;
  white-space: nowrap;
}

.name-point {
  color: #ff9800;
  font-weight: bold;
}

/* Select 박스 스타일링 */
.select-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 250px;
}

.standard-select {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  font-size: 18px;
  border: 1px solid #333;
  border-radius: 0;
  appearance: none; /* 기본 화살표 숨김 */
  background-color: white;
  cursor: pointer;
}

.arrow-indicator {
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  background-color: #8da9d4;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* 클릭 이벤트가 select에 전달되도록 설정 */
}

/* 하단 버튼 가로 배치 */
.button-area {
  display: flex;
  gap: 20px;
}

.action-btn {
  width: 140px;
  height: 50px;
  background-color: #547cc4;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background-color: #4365a3;
}
</style>
