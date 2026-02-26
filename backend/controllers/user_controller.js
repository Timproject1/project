const service = require("../services/user_service");
const ctrl = {
  signup: async (req, res) => {
    try {
      // 1. 데이터 받기
      const result = await service.registerUser(req.body);

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
  },
  login: async function (req, res) {
    console.log("con");
    const { id, password } = req.body;
    console.log(id, password);
    try {
      const info = await service.login({ id, password });
      console.log(info);
      res.json({ retCode: "OK", info });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  check: async function (req, res) {
    console.log(req.params.id);
    try {
      const result = await service.check(req.params.id);
      console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  signUp: async function (req, res) {
    console.log("signup con");
    console.log(req.body);
    const member = req.body;
    try {
      const result = await service.signUp(member);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
    }
  },
  prioritySetting: async (req, res) => {
    console.log(req.body);
    const priority = req.body;
    try {
      const result = await service.prioritySetting(priority);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  priorityApp: async (req, res) => {
    console.log(req.params.id);
    const priority = req.params.id;
    try {
      const result = await service.priorityApp(priority);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};

module.exports = ctrl;
