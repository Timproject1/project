const router = require("express").Router();
const ctrl = require("../controllers/form_controller");

router.get("/list", ctrl.getList);
router.post("/write", ctrl.writeForm);
router.get("/usageForm", ctrl.usageForm);
router.get("/getForm/:num", ctrl.getForm);
module.exports = router;
