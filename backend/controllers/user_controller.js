const service = require("../services/user_service");
const ctrl = {
  login: async function (req, res) {
    console.log("con");
    const { id, password } = req.body;
    console.log(id, password);
    try {
      const result = await service.login({ id, password });
      console.log(result);
      res.json({ retCode: "OK", result });
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
  info: async (req, res) => {
    console.log(req.params.id);
    try {
      const result = await service.info(req.params.id);
      res.json({ retCode: "OK", result });
    } catch (err) {
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
