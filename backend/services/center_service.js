const pool = require("../db/mapper");

const service = {
  getList: async function name(filter) {
    console.log("서비스 시작함:", filter);
    try {
      const query = `select * from supported_test`;
      const result = await pool.query(query);
      console.log("DB 연결 성공:", result);
      return result;
    } catch (error) {
      console.log("조회 에러:", error);
      return [];
    }
  },
  addSupported: async function (data) {
    console.log("서비스 데이터 확인:", data);
    try {
      const maxNumQuery = `SELECT sup_num FROM supported_test ORDER BY sup_num DESC LIMIT 1`;
      const maxResult = await pool.query(maxNumQuery);

      let newSupNum = "SUP-1";

      if (maxResult.length > 0 && maxResult[0].sup_num) {
        const lastNum = maxResult[0].sup_num;
        const numberOnly = parseInt(lastNum.split("-")[1]);
        newSupNum = `SUP-${numberOnly + 1}`;
      }

      // 1. 쿼리문 (컬럼 총 9개)
      const query = `insert into supported_test (sup_num, user_id, sup_name, sup_address, sup_email, sup_tel, sup_approved, sup_gender, sup_birthday)
                      values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        newSupNum,
        data.user_id,
        data.sup_name,
        data.sup_address,
        data.sup_email,
        data.sup_tel,
        data.sup_approved,
        data.sup_gender,
        data.sup_birthday,
      ];
      const result = await pool.query(query, values);
      console.log("DB저장 성공!", result);
      return result;
    } catch (error) {
      console.log("DB 저장안됨 에러 로그:", error);
      throw error;
    }
  },
};
module.exports = service;
