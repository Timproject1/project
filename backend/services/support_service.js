const pool = require("../db/mapper");

const service = {
  // 지원자 등록 (테이블명을 조회하는 곳과 일치시킴)
  addSupported: async function (data) {
    try {
      // 1. 번호 생성 (기존 로직 유지하되 테이블명 통일)
      const [maxResult] = await pool.query(
        `SELECT sup_num FROM supported ORDER BY sup_num DESC LIMIT 1`,
      );

      let newSupNum = "SUP-1";
      if (maxResult.length > 0 && maxResult[0].sup_num) {
        const lastNum = maxResult[0].sup_num;
        const numberOnly = parseInt(lastNum.split("-")[1]);
        newSupNum = `SUP-${numberOnly + 1}`;
      }

      // 2. INSERT (supported_test 테이블 사용)
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

  // 지원자 목록 가져오기 (테이블명 통일 및 결과 반환 수정)
  getSupportedList: async function (managerId) {
    try {
      // 뷰(getSupportList)가 아니라 실제 저장되는 테이블(supported_test)을 조회해야 합니다.
      // 만약 뷰를 꼭 써야 한다면 뷰 정의 자체에 supported_test가 포함되어야 합니다.
      let query = `SELECT * FROM supported`;
      const params = [];

      if (managerId) {
        query += ` WHERE manager = ?`; // manager 컬럼이 supported_test에 있는지 확인 필요
        params.push(managerId);
      }

      query += ` ORDER BY sup_num DESC`; // 최신순 정렬

      const [rows] = await pool.query(query, params);
      return rows; // [rows]로 받아서 rows만 반환해야 프론트에서 데이터가 바로 보입니다.
    } catch (err) {
      console.error("지원자 목록 조회 실패:", err);
      throw err;
    }
  },
};

module.exports = service;
