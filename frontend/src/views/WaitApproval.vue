<template>
  <div>
    <!-- 안내 메시지 출력 -->
    본 서비스는 가입하시는 기관의 관리자가 승인 처리 후 이용 가능합니다.
    <br /><br />
    * 문의사항은 기관으로 연락주세요
    <br />
    <!-- 스토어에 저장된 기관 정보(전화번호 등)를 화면에 표시 -->
    전화번호: {{ memberStore.center }}
  </div>
</template>

<script setup>
// 회원 정보를 관리하는 스토어(Store) 불러오기
import { useMemberStore } from "@/store/member";

// 스토어 객체를 생성하여 템플릿에서 사용할 수 있게 준비
const memberStore = useMemberStore();
</script>
