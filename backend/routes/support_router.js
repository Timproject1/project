const router = require("express").Router();
const ctrl = require("../controllers/support_controller");

router.get("/list", ctrl.getNums);
module.exports = router;
