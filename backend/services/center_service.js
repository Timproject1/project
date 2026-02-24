const pool = require("../db/mapper");

const service = {
  getList: async function name(filter) {
    console.log("ser");
    console.log(filter);
    try {
      const query = `select registernum,center_name,center_addr,center_tel from center where runed!="g3" and center_name like ?`;
      const result = await pool.query(query, [`%${filter}%`]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  addSupported: async function (data) {
    console.log("서비스 데이터 확인:", data);
    try {
      // 1. 쿼리문 (컬럼 총 9개)
      const query = `insert into supported_test (sup_num, user_id, sup_name, sup_address, sup_email, sup_tel, sup_approved, sup_gender, sup_birthday)
                      values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        data.sup_num,
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
