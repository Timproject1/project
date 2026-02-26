const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

// 회원가입
router.post("/signup", userController.signup);

// 아이디 중복 확인
router.post("/check-id", userController.checkId);

// 로그인 경로
router.post("/login", userController.login);

// 아이디 찾기 경로 추가
// router.post("/find-id", userController.findId);
// const router = require("express").Router();
// const ctrl = require("../controllers/user_controller");
// console.log("route");
// router.post("/login", ctrl.login); //로그인
// router.get("/check/:id", ctrl.check); //중복체크
// router.post("/signup", ctrl.signUp);
// router.post("/priority", ctrl.prioritySetting); //우선순위 신청
// router.get("/priority/:id", ctrl.priorityApp); //우선순위 신청 데이터 당겨오기
// router.post("/priority_manager", ctrl.appPriority); //우선순위 승인
// router.post("/returnPriority_manager", ctrl.returnPriority); //우선순위 반려
// router.post("/record", ctrl.addrecord); //상담기록 추가
// router.get("/recordlist", ctrl.recordList); //상담기록 출력
// router.get("/modifyRecordlist/:id", ctrl.modifyRecordList); //상담기록 수정내역 출력
// router.post("/saverecord", ctrl.saveRecord); //임시저장

module.exports = router;
