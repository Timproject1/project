const router = require("express").Router();
const ctrl = require("../controllers/user_controller");
console.log("route");
router.post("/login", ctrl.login); //로그인
router.get("/check/:id", ctrl.check); //중복체크

module.exports = router;
