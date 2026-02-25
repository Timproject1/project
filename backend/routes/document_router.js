const router = require("express").Router();
const ctrl = require("../controllers/document_controller");

router.get("/list", ctrl.getList);
router.get("/getForm", ctrl.getForm);
router.post("/write", ctrl.writeDoc);
module.exports = router;
