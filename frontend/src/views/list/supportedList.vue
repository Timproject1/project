<script setup>
// 전체 완료 (DB연결 포함) css만 수정하면 됨 - 3월 3일
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const isOpen = ref(true);
const currentTab = ref("list");
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const supported = ref([]);
const searchName = ref("");
const manager = ref("");

// 지원자 목록 가져오기
const getSupportedList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/supported/list");
    // 임시 데이터 생성
    // map: 배열 안 데이터들을 하나씩 꺼내서 담아주는 도구
    // priorityValue: 우선순위 값 (화면에 직접 글자로 보여줄 내용을 담는 변수)
    // priorityClass: 우선순위 클래스 (css 스타일 적용할 때 사용)
    if (response.data.retCode === "OK") {
      supported.value = response.data.result.map((item, index) => {
        let priorityValue = "계획";
        let priorityClass = "p-plan";

        // index: 목록의 번호
        // %: 나누기
        if (index % 3 === 0) {
          priorityValue = "긴급";
          priorityClass = "p-emergency";
          // 나머지가 1인 경우
        } else if (index % 3 === 1) {
          priorityValue = "중점";
          priorityClass = "p-focus";
        }
        return {
          ...item, // DB에서 가져온 데이터를 그대로 복사
          temp_priority: priorityValue,
          temp_class: priorityClass,
        };
      });
      console.log("데이터 가져오기 성공", supported.value);
    }
  } catch (err) {
    console.log("데이터 가져오기 오류:", err);
  }
};
const getlabel = (code) => {
  const labels = {
    d1: "대기",
    d2: "승인",
    d3: "반려",
    d4: "재승인",
  };
  return labels[code] || "-";
};
onBeforeMounted(async() => {
  await getSupportedList();
});
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
            지원자 현황
          </li>
          <li
            class="sub-item"
            :class="{ active: currentTab === 'info' }"
            @click="router.push('/list/info')"
          >
            지원자 정보 관리
          </li>
        </ul>
      </div>

      <div class="search-box">
        <h3 class="search-title">지원자 검색</h3>
        <div class="search-form">
          <div class="form-group">
            <label>지원자 명</label>
            <input type="text" v-model="searchName" />
          </div>
          <div class="form-group">
            <label>대기단계</label>
            <div class="gender-btns">
              <button class="active">전체</button>
              <button>계획</button>
              <button>중점</button>
              <button>긴급</button>
            </div>
          </div>
          <div class="form-group">
            <label>장애유형</label>
            <input type="text" />
          </div>
          <div class="form-group">
            <label>담당자</label>
            <input type="text" v-model="manager" />
          </div>
          <button class="search-btn" @click="resetSearch">검색</button>
        </div>
      </div>
    </aside>
    <div class="content">
      <div class="header-section">
        <h2>지원자 현황목록</h2>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>대기단계</th>
              <th>최근 서류작성일</th>
              <th>작성 서류상태</th>
              <th>담당자 배정일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in supported" :key="member.sup_num">
              <td>{{ member.sup_num }}</td>
              <td>{{ member.sup_name }}</td>
              <td>
                <span :class="['priority-badge', member.temp_class]">
                  {{ member.temp_priority }}
                </span>
              </td>
              <td>
                {{
                  member.sup_reg_date ? member.sup_reg_date.split("T")[0] : ""
                }}
              </td>
              <td>{{ getlabel(member.sup_approved) }}</td>
              <td>
                {{
                  member.sup_reg_date ? member.sup_reg_date.split("T")[0] : ""
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button>이전</button>
        <span class="pages">
          <span class="active">1</span> <span>2</span> <span>3</span>
        </span>
        <button>다음</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
th,
td {
  padding: 12px;
  border: 1px solid #000000;
  text-align: center;
  white-space: nowrap;
}
.content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
}

.pages {
  display: flex;
  gap: 8px;
}

.pages span {
  cursor: pointer;
  padding: 5px 10px;
}

.pages span.active {
  font-weight: bold;
  color: #e53e3e;
  border-bottom: 2px solid #4caf50;
}
.layout-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
}

.sidebar-container {
  width: 280px;
  flex-shrink: 0;
}

.content {
  flex-grow: 1;
  min-width: 0;
}
.priority-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 60px;
}

.p-emergency {
  background-color: #f8d7da;
  color: #000000;
  border: 1px solid #f5c6cb;
}

.p-focus {
  background-color: #fff3cd;
  color: #000000;
  border: 1px solid #ffeeba;
}

.p-plan {
  background-color: #d4edda;
  color: #000000;
  border: 1px solid #c3e6cb;
}
</style>
