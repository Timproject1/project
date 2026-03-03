const MypageService = require("../services/mypage_service");
const ctrl = {
  checkPassword: async (req, res) => {
    try {
      const { user_id, password } = req.body;
      const result = await MypageService.checkPassword(user_id, password);
      if (result) {
        res.status(200).json({ success: true });
      } else {
        res
          .status(401)
          .json({ success: false, message: "비밀번호가 틀렸습니다" });
      }
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const { user_id } = req.query;
      const userInfo = await MypageService.getUserInfo(user_id);
      res.status(200).json(userInfo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateInfo: async (req, res) => {
    try {
      const updateData = req.body;
      const result = await MypageService.updateInfo(updateData);
      res.status(200).json({ success: true, message: "수정완료" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
module.exports = ctrl;
