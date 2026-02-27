const router = require("express").Router();
const ctrl = require("../controllers/form_controller");

router.get("/list", ctrl.getList);
router.post("/write", ctrl.writeForm);
module.exports = router;
