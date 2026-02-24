const service = require("../services/center_service");
const ctrl = {
  // 기존 목록 불러오기
  getList: async function (req, res) {
    const filter = req.query ? req.query.filter : "";
    try {
      const result = await service.getList(filter);
      console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  // 신규 지원자 등록 (지원자 정보에서 지원자 추가 등록 부분)
  addSupported: async function (req, res) {
    try {
      const data = req.body;
      console.log("등록요청 데이터", data);
      const result = await service.addSupported(data);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
