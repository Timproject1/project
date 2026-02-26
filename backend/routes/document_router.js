const router = require("express").Router();
const ctrl = require("../controllers/document_controller");

router.get("/list", ctrl.getList);
router.get("/getDoc/:num", ctrl.getDoc);
router.get("/usageForm", ctrl.usageForm);
router.post("/write", ctrl.writeDoc);
router.get("/getForm/:num", ctrl.getForm);
router.get("/getResp/:num", ctrl.getResp);
module.exports = router;
