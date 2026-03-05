<script setup>
import { ref, onMounted } from "vue";

// 실제 DB에서 가져온 데이터를 담을 배열 (초기값 빈 배열)
const userInfo = ref([]);

const choiceUser = ref({});
const showInfo = ref(true);
const Noapprove = ref(false);
const Reason = ref("");

// DB에서 일반회원 승인신청목록 받아오기
const fetchUsers = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/mypage/admin/users/pending",
    );
    console.log(response);
    if (response.ok) {
      userInfo.value = await response.json();
    }
  } catch (error) {
    console.error("목록 로드 실패:", error);
  }
};

// 페이지 로드 시 목록 실행
onMounted(() => {
  fetchUsers();
});

// 등록 버튼 클릭 시 일반회원 상세 정보를 보여주는 부분
const viewInfo = (user) => {
  choiceUser.value = user;
  showInfo.value = false;
  Noapprove.value = false;
  console.log(choiceUser.value);
};

// 회원 가입승인버튼 눌렀을 때 (추가 + 승인을 누르면 목록에서 삭제)
const Okapprove = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/mypage/admin/users/approve",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: choiceUser.value.user_id }),
      },
    );
    // 승인 완료 후 승인 안내 메세지, 목록에서 삭제
    if (response.ok) {
      alert(`${choiceUser.value.user_name} 님을 승인 하였습니다.`);
      userInfo.value = userInfo.value.filter(
        (user) => user.user_id !== choiceUser.value.user_id,
      );
      showInfo.value = true;
    }
  } catch (error) {
    alert("승인 처리 실패");
  }
};

const reasonModal = () => {
  Noapprove.value = true;
};

// 반려 사유 입력 부분 (필요 시 DB 삭제/상태변경 로직 추가 가능)
const confirmReject = () => {
  if (!Reason.value) return alert("반려 사유를 입력하세요");

  // 현재는 프론트에서만 필터링 (DB 연동 시 승인과 비슷하게 fetch 추가 필요)
  userInfo.value = userInfo.value.filter(
    (user) => user.user_id !== choiceUser.value.user_id,
  );

  Noapprove.value = false;
  showInfo.value = true;
  Reason.value = "";
  alert("반려 처리가 완료되었습니다.");
};
</script>

<template>
  <h3>일반회원 가입승인 요청 목록</h3>
  <table>
    <thead class="user_table">
      <tr>
        <th>번호</th>
        <th>아이디</th>
        <th>이름</th>
        <th>이메일 주소</th>
        <th>가입 신청일</th>
        <th>확인하기</th>
      </tr>
    </thead>
    <tbody v-if="showInfo">
      <tr v-for="(user, index) in userInfo" :key="user.user_id">
        <td>{{ index + 1 }}</td>
        <td>{{ user.user_id }}</td>
        <td>{{ user.user_name }}</td>
        <td>{{ user.user_email }}</td>
        <td>
          {{ user.user_reg_date ? user.user_reg_date.split("T")[0] : "" }}
        </td>
        <td><button @click="viewInfo(user)">등록</button></td>
      </tr>
    </tbody>
  </table>

  <div v-if="!showInfo" class="detail-container">
    <div v-if="!Noapprove">
      <h3>회원 상세정보</h3>
      <div class="info-details">
        <p><strong>아이디:</strong> {{ choiceUser.user_id }}</p>
        <p><strong>이름:</strong> {{ choiceUser.user_name }}</p>
        <p><strong>이메일:</strong> {{ choiceUser.user_email }}</p>
        <p><strong>연락처:</strong> {{ choiceUser.user_tel }}</p>
      </div>
      <button @click="Okapprove" class="btn-ok">승인</button>
      <button @click="reasonModal" class="btn-no">반려</button>
      <button @click="showInfo = true" class="btn-back">목록으로</button>
    </div>

    <div v-if="Noapprove" class="modal-overlay">
      <div class="modal-content">
        <h4>반려 사유입력</h4>
        <textarea
          v-model="Reason"
          placeholder="반려 사유를 입력하세요"
        ></textarea>
        <div class="modal-btns">
          <button @click="confirmReject">확인</button>
          <button @click="Noapprove = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
