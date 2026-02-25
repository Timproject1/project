const userService = require("../services/user_service");

const signup = async (req, res) => {
  try {
    // 1. 데이터 받기
    const result = await userService.registerUser(req.body);

    // 2. 성공 응답
    res.status(201).json({
      success: true,
      message: "회원가입 성공!",
    });
  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({
      success: false,
      message: "회원가입 중 오류 발생",
      error: err.message,
    });
  }
};

module.exports = {
  signup,
};
