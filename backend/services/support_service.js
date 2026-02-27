const pool = require("../db/mapper");

// 지원자 목록 보기 (일반회원)
const service = {
  getList: async (id) => {
    try {
      console.log("ser");
      console.log(id);
      const query = `select sup_num,sup_name,gender,sup_email,sup_address,sup_tel,birthday,approve from getSupportList where user_id= ? `;
      const result = await pool.query(query, [id]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  getSupportedList: async function () {
    try {
      const query = `select * from supported_test order by sup_num DESC`;
      // 결과 배열의 데이터만 꺼내서 rows라는 변수에 담기 위해 사용, query를 DB에 전달해서 실행
      const [rows] = await pool.query(query);
      return rows;
    } catch (err) {
      console.log("지원자 목록 중 DB에러:", err);
      throw err;
    }
  },
  // 지원자 등록
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

// 담당자에게 배정된 지원자 목록 보는 화면
const supportedLook = {
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
module.exports = supportedLook;
