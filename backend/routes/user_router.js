const router = require("express").Router();
const ctrl = require("../controllers/user_controller");
console.log("route");
router.post("/login", ctrl.login);
router.get("/check/:id", ctrl.check);

module.exports = router;
