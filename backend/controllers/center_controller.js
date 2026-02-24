const service = require("../services/center_service");
const ctrl = {
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
};
module.exports = ctrl;
