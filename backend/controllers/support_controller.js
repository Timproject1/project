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
    const connection = await pool.getConnection();
    try {
      const data = req.body;
      await connection.beginTransaction();
      // MAX 함수를 사용하여 가장 큰 숫자를 직접 가져옵니다.
      const rows = await pool.query(
        `SELECT MAX(CAST(REPLACE(sup_num, 'sup-', '') AS UNSIGNED)) as maxNum FROM supported`,
      );

      const resultData = Array.isArray(rows) ? rows[0] : rows;
      const maxNum = resultData.maxNum ? Number(resultData.maxNum) : 0;
      const nextNum = maxNum + 1;

      // 지원자 번호 (sup_num)
      const generatedSupNum = `sup-${nextNum}`;

      // 2. 새로운 데이터 INSERT
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

      if (data.disability_codes && data.disability_codes.length > 0) {
        const disValues = data.disability_codes.map((code, index) => [
          `supdisa-${generatedSupNum.split("-")[1]} -${index + 1}`,
          generatedSupNum,
          code,
        ]);
        const Disquery = `insert into disabilities (category_num, sup_num, disability_code) values ?`;
        await connection.query(Disquery, [disValues]);
      }
      await connection.commit();
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
    } finally {
      connection.release();
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
  allowList: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("로그인 ID:", id);
      // 담당자 id join 호출
      const result = await service.allowList(id);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  getDisabilities: async (req, res) => {
    try {
      const { sup_num } = req.query;
      const query = `select dc.disability_category as type, 
                            dc.disability_level as level
                            from disabilities ds
                            join disability_code dc on ds.disability_code = dc.disability_code
                            where ds.sup_num = ?`;

      const rows = await pool.query(query, [sup_num]);
      res.json(rows);
    } catch (error) {
      console.error("상세 조회에러:", error);
      res.status(500).json({ error: error.message });
    }
  },
  updateSupported: async (req, res) => {
    try {
      const query = `update supported set sup_name = ?, sup_tel = ?, sup_address =?, disability_category = ?, sup_file = ?
      where sup_num = ?`;
      const result = await pool.query([
        sup_num,
        sup_name,
        sup_tel,
        sup_address,
        disability_category || null,
        sup_file || null,
        sup_num,
      ]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "수정완료" });
      } else {
        res.status(404).json({ error: "해당 지원자를 찾을 수 없습니다" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "서버 오류" });
    }
  },
};
module.exports = ctrl;
