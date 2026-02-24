const router = require("express").Router();
const ctrl = require("../controllers/document_controller");

router.get("/list", ctrl.getList);
module.exports = router;
