const service = require("../services/support_service");
const ctrl = {
  getList: async (req, res) => {
    try {
      console.log(req.query);
      const result = await service.getList(req.query.id);
      console.log("contr");
      console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
