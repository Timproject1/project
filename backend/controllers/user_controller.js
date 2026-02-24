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
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
