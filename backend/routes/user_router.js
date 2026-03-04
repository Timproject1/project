const express = require("express");
const router = express.Router();
const userService = require("../services/user_service");
const con = require("../controllers/user_controller");

// 아이디 중복 확인
router.post("/check-id", async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await userService.check(user_id);
    const count = result ? result.count || result["COUNT(*)"] || 0 : 0;
    return res.json({ isDuplicate: count > 0 });
  } catch (err) {
    console.error("중복확인 라우터 에러:", err);
    return res.status(500).json({ success: false, message: "서버 에러" });
  }
});

//  회원가입 실행
router.post("/signup", async (req, res) => {
  try {
    const result = await userService.signUp(req.body);
    return res.json({ success: true, message: "가입 성공" });
  } catch (err) {
    console.error("회원가입 라우터 에러:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { user_id, user_password } = req.body;
    const user = await userService.login(user_id, user_password);
    if (user) {
      return res.json({ success: true, user });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "정보가 틀립니다." });
    }
  } catch (err) {
    console.error("로그인 라우터 에러:", err);
    return res.status(500).json({ success: false, message: "서버 에러" });
  }
});

router.get("/getManager/:id", con.getManager); //아이디를 기준으로 같은센터의 담당자,관리자 받아오기

router.post("/find-id", async (req, res) => {
  try {
    const { userName, userEmail } = req.body;
    const userId = await userService.findId(userName, userEmail);

    if (userId) {
      return res.json({ success: true, userId: userId });
    } else {
      return res.json({ success: false, message: "일치하는 정보가 없습니다." });
    }
  } catch (err) {
    console.error("아이디 찾기 라우터 에러:", err);
    return res.status(500).json({ success: false, message: "서버 에러" });
  }
});

module.exports = router;
