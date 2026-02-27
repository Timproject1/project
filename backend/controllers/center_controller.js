const service = require("../services/center_service");
const ctrl = {
  // 기존 목록
  getList: async function (req, res) {
    const filter = req.query.filter ? req.query.filter : "";
    try {
      const result = await service.getList(filter);
      console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },

  addCenter: async function (req, res) {
    try {
      const data = req.body;
      console.log("등록요청 데이터", data);
      const result = await service.addCenter(data);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
