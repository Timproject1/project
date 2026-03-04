const pool = require("../db/mapper");

const service = {
  // 지원자 목록 가져오기
  getList: async function (managerId) {
    try {
      let query = `SELECT * FROM supported`;
      const params = [];

      if (managerId) {
        query += ` WHERE user_id = ?`; // manager 컬럼이 supported_test에 있는지 확인 필요
        params.push(managerId);
      }

      query += ` ORDER BY sup_num DESC`;

      const rows = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("지원자 목록 조회 실패:", err);
      throw err;
    }
  },
  // 지원자 등록
  addSupported: async function (data) {
    try {
      // 1. 번호 생성
      const [maxResult] = await pool.query(
        `SELECT sup_num FROM supported ORDER BY sup_num DESC LIMIT 1`,
      );

      let newSupNum = "SUP-1";
      if (maxResult.length > 0 && maxResult[0].sup_num) {
        const lastNum = maxResult[0].sup_num;
        const numberOnly = parseInt(lastNum.split("-")[1]);
        newSupNum = `SUP-${numberOnly + 1}`;
      }

      // 2. INSERT
      const query = `INSERT INTO supported 
      (sup_num, user_id, sup_name, sup_address, sup_email, sup_tel, sup_reg_date, sup_approved, birthday, gender) 
      VALUES (?, ?, ?, ?, ?, ?, now(), ?, ?, ?)`;
      const values = [
        newSupNum,
        data.user_id || "user", // user_id가 없을 경우 대비
        data.sup_name,
        data.sup_address,
        data.sup_email || "",
        data.sup_tel,
        "d1", // 기본 상태값
        data.sup_gender === "남성" ? "m1" : "f1",
        data.sup_birthday,
      ];

      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      console.error("DB 저장 에러:", error);
      throw error;
    }
  },
  getSupportedList: async function (managerId) {
    try {
      // 지원신청서(documents) 테이블 + 지원자 목록(suppororted)과 sup_num과 join 하기
      let query = `select S.sup_num, S.sup_name, S.sup_reg_date, S.sup_approved,
          D.doc_num, D.write_date, D.progress, D.priority, D.manager
          from supported S
          left join documents D ON S.sup_num = D.sup_num`;

      const params = []; // DB에 전달 할 값들을 순서대로 저장하는 곳

      if (managerId) {
        query += ` where D.manager = ?`;
        params.push(managerId);
      }
      // 작성일 기준 역순으로 내림차순 정렬
      query += ` order by D.write_date DESC`;

      const result = await pool.query(query, params);
      return result;
    } catch (err) {
      console.error("지원자 목록 join 실패:", err);
      throw err;
    }
  },
};


module.exports = service;
