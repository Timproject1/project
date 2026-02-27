const service = require("../services/support_service");
const ctrl = {
  getList: async (req, res) => {
    try {
      console.log(req.query);
      const managerId = req.query.id;
      console.log("로그인 한 담당자 ID:", managerId);

      // 담당자 id join 호출
      const result = await service.getList(managerId);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
