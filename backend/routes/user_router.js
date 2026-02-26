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
router.post("/find-id", userController.findId);

module.exports = router;
