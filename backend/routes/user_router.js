const router = require("express").Router();
const ctrl = require("../controllers/user_controller");
console.log("route");
router.post("/login", ctrl.login); //로그인
router.get("/check/:id", ctrl.check); //중복체크
router.post("/signup", ctrl.signUp);
router.post("/priority", ctrl.prioritySetting);
router.get("/priority/:id", ctrl.priorityApp);

module.exports = router;
