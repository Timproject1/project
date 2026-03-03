const service = require("../services/support_service");
const pool = require("../db/mapper");

const ctrl = {
  getList: async (req, res) => {
    try {
      console.log(req.query);
      const managerId = req.query.id;
      console.log("로그인 한 담당자 ID:", managerId);

      // 담당자 id join 호출
      const result = await service.getList(managerId);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  addSupported: async (req, res) => {
    try {
      const data = req.body;

      // [수정된 1번 단계]: 번호 추출 방식을 더 직관적이고 안전하게 변경
      // MAX 함수를 사용하여 가장 큰 숫자를 직접 가져옵니다.
      const rows = await pool.query(
        `SELECT MAX(CAST(REPLACE(sup_num, 'sup-', '') AS UNSIGNED)) as maxNum FROM supported`,
      );

      // mysql2 라이브러리 특성상 결과값이 rows[0] 또는 rows[0][0]에 담길 수 있습니다.
      // 안전하게 데이터 존재 여부를 체크합니다.
      const resultData = Array.isArray(rows) ? rows[0] : rows;
      const maxNum = resultData.maxNum ? Number(resultData.maxNum) : 0;
      const nextNum = maxNum + 1;

      // 최종 생성 번호 (예: 'sup-2')
      const generatedSupNum = `sup-${nextNum}`;

      // 2. 새로운 데이터 INSERT (이후 로직은 동일)
      const query = `INSERT INTO supported 
      (sup_num, user_id, sup_name, sup_address, sup_email, sup_tel, sup_reg_date, sup_approved, birthday, gender) 
      VALUES (?, ?, ?, ?, ?, ?, now(), ?, ?, ?)`;

      const values = [
        generatedSupNum,
        "user",
        data.sup_name,
        data.sup_address,
        data.sup_email || "",
        data.sup_tel,
        "d1",
        data.sup_birthday,
        data.sup_gender === "남성" ? "m1" : "f1",
      ];

      await pool.query(query, values);

      res.json({
        retCode: "OK",
        message: "정상 등록되었습니다.",
        sup_num: generatedSupNum,
      });
    } catch (err) {
      console.error("백엔드 로직 에러:", err);
      // 에러 메시지가 중복 키 에러라면 더 상세히 출력
      res
        .status(500)
        .json({ retCode: "NG", message: err.sqlMessage || err.message });
    }
  },
  getManagers: async (req, res) => {
    try {
      const query = `select user_id, user_name, user_tel from member where grade = 'a2'`;
      const managers = await pool.query(query);
      res.json(managers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = ctrl;
