<script setup></script>
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
            @click="currentTab = 'list'"
          >
            - 지원자 목록
          </li>
          <li
            class="sub-item"
            :class="{ active: currentTab === 'info' }"
            @click="currentTab = 'info'"
          >
            - 지원자 정보
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
            <label>성별</label>
            <div class="gender-btns">
              <button class="active">전체</button>
              <button>남성</button>
              <button>여성</button>
            </div>
          </div>
          <div class="form-group">
            <label>장애유형</label>
            <input type="text" />
          </div>
          <div class="form-group">
            <label>담당자</label>
            <input type="text" v-model="counsel_manager" />
          </div>
          <button class="search-btn" @click="resetSearch">검색</button>
        </div>
      </div>
    </aside>
    <div class="content">
      <div class="header-section">
        <h2>지원자 목록</h2>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>생년월일</th>
              <th>성별</th>
              <th>휴대폰 번호</th>
              <th>주소</th>
              <th>장애유형</th>
              <th>담당자</th>
              <th>지원자 등록일</th>
              <th>지원자 정보</th>
              <th>정보 수정일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in supported" :key="member.sup_num">
              <td>{{ member.sup_num }}</td>
              <td>{{ member.sup_name }}</td>
              <td>{{ member.birthday }}</td>
              <td>{{ member.gender }}</td>
              <td>{{ member.sup_tel }}</td>
              <td>{{ member.sup_address }}</td>
              <td>{{ member.disability_code }}</td>
              <td>{{ member.plan_manager }}</td>
              <td>{{ member.plans || "-" }}</td>
              <td>{{ member.results || "-" }}</td>
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
