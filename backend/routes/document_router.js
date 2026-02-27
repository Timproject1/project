const router = require("express").Router();
const ctrl = require("../controllers/document_controller");

router.get("/list", ctrl.getList);
// router.get("/getDoc/:num", ctrl.getDoc);
// router.get("/usageForm", ctrl.usageForm);
router.post("/write", ctrl.writeDoc);
router.get("/getForm/:num", ctrl.getForm);
// router.get("/getResp/:num", ctrl.getResp);
router.post("/priority", ctrl.prioritySetting); //우선순위 신청
router.get("/priority/:id", ctrl.priorityApp); //우선순위 신청 데이터 당겨오기
router.post("/priority_manager", ctrl.appPriority); //우선순위 승인
router.post("/returnPriority_manager", ctrl.returnPriority); //우선순위 반려
router.post("/record", ctrl.addrecord); //상담기록 추가
router.get("/recordlist", ctrl.recordList); //상담기록 출력
router.get("/modifyRecordlist/:id", ctrl.modifyRecordList); //상담기록 수정내역 출력
router.post("/saverecord", ctrl.saveRecord); //상담기록 임시저장
router.post("/bringrecord", ctrl.saveRecordBring); //상담기록 임시저장 불러오기
router.post("/Updaterecord", ctrl.UpdateRecord); //상담기록 임시저장 불러오기
router.post("/plan", ctrl.addplan); //지원기획서 추가
router.get("/planlist", ctrl.planList); //지원계획서 출력
router.post("/saveplan", ctrl.savePlan); //지원기획서 임시저장
router.post("/bringplan", ctrl.savePlanBring); //지원기획서 임시저장 불러오기
router.post("/appplan", ctrl.appPlan); //지원기획서 승인(관리자)
router.post("/returnplan", ctrl.returnPlan); //지원기획서 반려(관리자)
router.post("/restartplan", ctrl.restartPlan); //지원기획서 재승인

module.exports = router;
