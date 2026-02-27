const service = require("../services/form_service");
const ctrl = {
  getList: async (req, res) => {
    try {
      const result = await service.getList();
      console.log("contr");
      console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  writeForm: async (req, res) => {
    try {
      const form = req.body.form;
      console.log("con");
      console.log(form);
      const result = await service.writeForm(form);
      res.send("ok");
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
module.exports = ctrl;
