const router = require("express").Router();
const ctrl = require("../controllers/center_controller.js");
console.log("route");
router.get("/list", ctrl.getList);

module.exports = router;
