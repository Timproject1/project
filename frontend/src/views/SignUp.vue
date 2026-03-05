<script setup>
import { ref, reactive, computed } from "vue"; // Vue의 반응형 상태 관리 및 계산된 속성 도구 임포트
import { useRouter } from "vue-router"; // 페이지 이동을 위한 라우터 도구 임포트
import axios from "axios"; // API 통신을 위한 axios 라이브러리 임포트
import MaterialInput from "@/components/MaterialInput.vue"; // 커스텀 입력창 컴포넌트 임포트

const router = useRouter(); // 라우터 인스턴스 생성

// 회원가입 폼에 입력될 데이터를 담는 반응형 객체
const form = reactive({
  user_id: "", // 사용자 아이디
  user_password: "", // 비밀번호
  user_name: "", // 사용자 이름
  user_tel: "", // 연락처
  user_email: "", // 이메일
  registernum: "", // 선택된 기관의 고유 등록 번호
  grade: "a1", // 회원 등급 (기본값 a1: 일반사용자)
  actived: "i1", // 계정 상태 (기본값 i1: 승인 대기 등)
});

const userPwCheck = ref(""); // 비밀번호 일치 확인을 위한 입력값 저장 변수
const institutionName = ref(""); // 화면에 표시될 기관의 이름
const emailDuplicate = ref(false); // 이메일 중복 상태 (UI 표시용)
const isModalOpen = ref(false); // 기관 검색 모달창의 열림/닫힘 상태
const searchQuery = ref(""); // 모달 내 기관 검색어 저장 변수
const centers = ref([]); // 검색 결과로 받은 기관 목록 저장 배열

// 비밀번호와 확인용 비밀번호가 입력되었을 때, 두 값이 서로 다른지 실시간으로 확인
const isPasswordMismatch = computed(() => {
  return (
    form.user_password !== "" &&
    userPwCheck.value !== "" &&
    form.user_password !== userPwCheck.value
  );
});

// 아이디 중복 확인 버튼 클릭 시 실행되는 함수
const checkIdDuplication = async () => {
  if (!form.user_id) {
    alert("아이디를 입력해주세요."); // 아이디 미입력 시 경고
    return;
  }
  try {
    const res = await axios.post("http://localhost:3000/user/check-id", {
      user_id: form.user_id, // 서버로 현재 입력된 아이디 전송
    });
    alert(
      res.data.isDuplicate
        ? "이미 사용 중인 아이디입니다." // 중복된 경우
        : "사용 가능한 아이디입니다.", // 사용 가능한 경우
    );
  } catch (e) {
    alert("서버 연결 실패"); // 서버 에러 발생 시
  }
};

// 기관 검색 버튼 클릭 시 서버에서 기관 목록을 가져오는 함수
const fetchInstitutions = async () => {
  try {
    const url = `http://localhost:3000/center/list`;
    const res = await axios.get(url, { params: { name: searchQuery.value } }); // 검색어를 쿼리로 전달

    console.log("서버 응답 데이터:", res.data);
    centers.value = res.data.result; // 받아온 기관 데이터를 배열에 저장
  } catch (e) {
    console.error("에러 상세:", e);
    alert("서버 연결에 실패했습니다.");
  }
};

// 모달 테이블에서 특정 기관의 '사용' 버튼을 클릭했을 때 처리
const selectOrg = (org) => {
  institutionName.value = org.center_name; // 화면에 기관명 표시
  form.registernum = org.registernum; // 가입 데이터에 해당 기관 번호 저장
  isModalOpen.value = false; // 선택 완료 후 모달 닫기
};

// 최종 '가입하기' 버튼 클릭 시 실행되는 함수
const handleSignup = async () => {
  // 필수 입력값이 빠졌는지 최종 확인
  if (!form.user_id || !form.user_password || !form.registernum) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }
  try {
    const res = await axios.post("http://localhost:3000/user/signup", form); // 전체 데이터 전송
    if (res.data.success) {
      alert("회원가입 완료!"); // 가입 성공 메시지
      router.push("/sign-in"); // 로그인 페이지로 페이지 이동
    }
  } catch (e) {
    alert("가입 실패"); // 가입 실패 메시지
  }
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-wrap">
      <h2 class="signup-title">회원가입</h2>

      <!-- 가입 유형 선택 행 -->
      <div class="form-row">
        <label class="row-label">가입 유형</label>
        <div class="row-content">
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="form.grade" value="a2" /> 기관담당자
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.grade" value="a1" /> 일반사용자
            </label>
          </div>
        </div>
      </div>

      <!-- 아이디 입력 행 -->
      <div class="form-row">
        <label class="row-label">아이디</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_id"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <button
            type="button"
            class="green-btn shadow-btn"
            @click="checkIdDuplication"
          >
            중복 확인
          </button>
        </div>
      </div>

      <!-- 비밀번호 입력 행 -->
      <div class="form-row">
        <label class="row-label">비밀번호</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_password"
              type="password"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <!-- 비밀번호 확인 행 및 에러 메시지 -->
      <div class="form-row">
        <label class="row-label">비밀번호 확인</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="userPwCheck"
              type="password"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <!-- 비밀번호 불일치 시 실시간 경고 표시 -->
          <p v-if="isPasswordMismatch" class="error-msg-abs">
            * 비밀번호가 틀렸습니다.
          </p>
        </div>
      </div>

      <!-- 이름 입력 행 -->
      <div class="form-row">
        <label class="row-label">이름</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_name"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <!-- 연락처 입력 행 -->
      <div class="form-row">
        <label class="row-label">연락처</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_tel"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
        </div>
      </div>

      <!-- 이메일 입력 행 -->
      <div class="form-row">
        <label class="row-label">이메일</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="form.user_email"
              type="email"
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <p v-if="emailDuplicate" class="error-msg-abs">
            * 기입 된 이메일입니다.
          </p>
        </div>
      </div>

      <!-- 기관명 검색 행 (ReadOnly) -->
      <div class="form-row">
        <label class="row-label">기관명</label>
        <div class="row-content">
          <div class="input-flex">
            <material-input
              v-model="institutionName"
              readonly
              variant="outline"
              class="flex-grow-1"
            />
            <span class="required">(필수)</span>
          </div>
          <button
            type="button"
            class="green-btn shadow-btn"
            @click="isModalOpen = true"
          >
            검색
          </button>
        </div>
      </div>

      <!-- 회원가입 완료 버튼 영역 -->
      <div class="btn-area">
        <button
          type="button"
          class="green-btn signup-btn shadow-btn"
          @click="handleSignup"
        >
          가입하기
        </button>
      </div>
    </div>

    <!-- 기관 검색 모달 레이어 (v-if로 조건부 렌더링) -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <!-- 모달 내부 검색창 -->
        <div class="modal-search-box">
          <label class="row-label" style="width: 80px">기관명</label>
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="fetchInstitutions"
            placeholder="기관명을 입력하세요"
          />
          <button type="button" class="green-btn" @click="fetchInstitutions">
            검색
          </button>
        </div>

        <!-- 검색 결과 데이터 출력 테이블 -->
        <div class="table-container">
          <table class="org-table">
            <thead>
              <tr>
                <th>기관명</th>
                <th>주소</th>
                <th>연락처</th>
                <th>사용</th>
              </tr>
            </thead>
            <tbody>
              <!-- 검색된 리스트 반복 출력 -->
              <tr v-for="center in centers" :key="center.registernum">
                <td>{{ center.center_name }}</td>
                <td>{{ center.center_addr }}</td>
                <td>{{ center.center_tel }}</td>
                <td>
                  <button
                    type="button"
                    class="green-btn select-btn"
                    @click="selectOrg(center)"
                  >
                    사용
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 모달 닫기 버튼 영역 -->
        <div style="text-align: right; margin-top: 20px">
          <button
            class="green-btn"
            style="background-color: #666"
            @click="isModalOpen = false"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 및 폼 스타일 유지 */
.signup-container {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
}
.signup-wrap {
  width: 100%;
  max-width: 800px;
  border: 2px solid #00a000;
  padding: 40px;
  border-radius: 12px;
}
.signup-title {
  text-align: center;
  margin-bottom: 40px;
  color: #00a000;
  font-size: 24px;
}
.form-row {
  display: flex;
  position: relative;
  margin-bottom: 30px;
  align-items: center;
}
.row-label {
  width: 150px;
  font-weight: bold;
  color: #333;
}
.row-content {
  flex: 1;
  display: flex;
  align-items: center;
}
.input-flex {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
}
.required {
  color: #ff5722;
  font-size: 0.8rem;
  white-space: nowrap;
  width: 60px;
  text-align: center;
}
.green-btn {
  background-color: #00a000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap;
}
.error-msg-abs {
  color: #f44335;
  font-size: 12px;
  position: absolute;
  bottom: -22px;
  left: 150px;
}
.btn-area {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.signup-btn {
  padding: 15px 60px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
}
/* 모달창 스타일 유지 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: white;
  padding: 30px;
  border: 1px solid #333;
  width: 750px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-search-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.modal-search-box input {
  flex: 1;
  height: 40px;
  border: 1px solid #ccc;
  padding: 0 10px;
}
.org-table {
  width: 100%;
  border-collapse: collapse;
}
.org-table th,
.org-table td {
  border: 1px solid #333;
  padding: 10px;
  text-align: center;
}
.org-table th {
  background: #eee;
}
</style>
