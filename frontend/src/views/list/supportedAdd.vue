<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isOpen = ref(false);
const currentTab = ref("add");

// 지원자 등록
const newSupported = ref({
  sup_name: "",
  sup_birthday: "",
  sup_gender: "",
  sup_tel: "",
  sup_address: "",
  disability_category: "",
  sup_file: "",
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const addForm = () => {
  alert(`${newSupported.value.sup_name} 지원자 등록 완료`);
  router.push("/list/info");
};
</script>
<template>
  <div class="layout-wrapper">
    <aside class="sidebar-container">
      <div class="management-box">
        <div class="box-header" @click="toggleMenu">
          지원자 관리 <span class="arrow">{{ isOpen ? "▼" : "▶" }}</span>
        </div>
        <ul v-if="isOpen" class="menu-list">
          <li
            :class="{ active: currentTab === 'list' }"
            @click="router.push('/list/supported')"
          >
            - 지원자 현황
          </li>
          <li
            class="sub-item"
            :class="{ active: currentTab === 'info' }"
            @click="router.push('/list/info')"
          >
            - 지원자 정보관리
          </li>
          <li>- 지원자 등록하기</li>
        </ul>
      </div>
    </aside>
  </div>
  <main class="main-container">
    <div class="form">
      <h2>지원자 등록</h2>
      <hr />

      <div class="form-container">
        <div class="form-row">
          <label>지원자명</label>
          <input type="text" v-model="newSupported.sup_name" />
        </div>
      </div>

      <div>
        <div class="form-row">
          <label>생년월일</label>
          <input type="text" v-model="newSupported.sup_birthday" />
        </div>
      </div>

      <div class="form-row">
        <label>성별</label>
        <div class="radio-group">
          <label
            ><input type="radio" v-model="sup_gender" value="남성" />
            남성</label
          >
          <label
            ><input type="radio" v-model="sup_gender" value="여성" />
            여성</label
          >
        </div>
      </div>

      <div class="form-row">
        <label>휴대폰 번호</label>
        <input type="text" v-model="sup_tel" />
      </div>

      <div class="form-row">
        <label>주소</label>
        <input type="text" v-model="sup_address" />
      </div>

      <div class="form-row">
        <label>장애유형</label>
        <input type="text" v-model="disability_category" />
      </div>

      <div class="form-row">
        <label>첨부파일</label>
        <input
          type="text"
          v-model="sup_file"
          placeholder="파일은 pdf,jpg파일만 등록 가능"
        />
      </div>
    </div>
    <button class="close-btn" @click="addForm">저장</button>
  </main>
</template>
