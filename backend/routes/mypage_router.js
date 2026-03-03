const router = require("express").Router();
const MypageController = require("../controllers/mypage_controller");

router.post("/check", MypageController.checkPassword);
router.get("/info", MypageController.getUserInfo);
router.put("/update", MypageController.updateInfo);

module.exports = router;
