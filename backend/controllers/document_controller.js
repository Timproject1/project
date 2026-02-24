const service = require("../services/document_service");
const ctrl = {
  getList: async (req, res) => {
    console.log(req.query);
    const info = {
      id: req.query.id ? req.query.id : "",
      centerCode: req.query.centerCode ? req.query.centerCode : "",
      grade: req.query.grade ? req.query.grade : "",
    };
    const filter = {
      writer_name: req.query.writer ? req.query.writer : "",
      maneger_name: req.query.maneger ? req.query.maneger : "",
      sup_name: req.query.sup ? req.query.sup : "",
    };
    try {
      const result = await service.getList(info, filter);
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
