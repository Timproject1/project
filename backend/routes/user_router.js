const express = require("express");
const router = express.Router();
const userService = require("../services/user_service");

// 1. 아이디 중복 확인
router.post("/check-id", async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await userService.check(user_id);
    const count = result ? result.count : 0;
    return res.json({ isDuplicate: count > 0 });
  } catch (err) {
    console.error("중복확인 라우터 에러:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. 회원가입 실행
router.post("/signup", async (req, res) => {
  try {
    console.log("프론트 데이터:", req.body);
    const result = await userService.signUp(req.body);
    return res.json({ success: true, message: "가입 성공" });
  } catch (err) {
    console.error("회원가입 라우터 에러:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user_id, user_password } = req.body;
    const user = await userService.login(user_id, user_password);

    if (user) {
      return res.json({ success: true, user });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "아이디나 비밀번호가 틀립니다." });
    }
  } catch (err) {
    console.error("로그인 라우터 에러:", err);
    return res.status(500).json({ success: false, message: "서버 에러" });
  }
});

module.exports = router;
