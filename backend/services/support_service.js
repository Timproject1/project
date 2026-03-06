const pool = require("../db/mapper");

const service = {
  // 지원자 목록 가져오기
  getList: async function (filters) {
    try {
      // 중복 제거를 위해 DISTINCT 또는 GROUP BY를 사용합니다.
      let query = `
      SELECT S.*, D.priority, D.progress 
      FROM supported S
      LEFT JOIN documents D ON S.sup_num = D.sup_num
      WHERE 1=1
    `;
      const params = [];

      if (filters) {
        // 이름 검색 로직 추가
        if (filters.sup_name) {
          query += ` AND S.sup_name LIKE ?`;
          params.push(`%${filters.sup_name}%`);
        }
        // 대기단계 검색 로직 추가
        if (filters.priority && filters.priority !== "전체") {
          query += ` AND D.priority = ?`;
          params.push(filters.priority);
        }
      }

      // 데이터 중복 방지를 위해 번호로 그룹화
      query += ` GROUP BY S.sup_num ORDER BY S.sup_num DESC`;

      const rows = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("조회 실패:", err);
      throw err;
    }
  },
  // 지원자 등록
  addSupported: async function (data) {
    try {
      // 1. 번호 생성
      const maxResult = await pool.query(
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

      const result = await pool.query(query, values);
      return result;
    } catch (error) {
      console.error("DB 저장 에러:", error);
      throw error;
    }
  },
  updataSupported: async function (memberData) {
    const { sup_num, sup_name, sup_tel, sup_address } = memberData;
    const query = `update supported set sup_name = ?, sup_tel = ?, sup_address = ?
    where sup_num = ?`;

    try {
      const result = await pool.query(query, [
        sup_name,
        sup_tel,
        sup_address,
        sup_num,
      ]);
      return result;
    } catch (error) {
      console.error("서비스 애러:", error);
      throw error;
    }
  },
  assignManager: async function (data) {
    const { sup_num, user_id } = data;

    // user_id를 업데이트하고 배정 상태(예: d1)로 변경하는 쿼리
    const query = `
    UPDATE supported
    SET sup_approved = 'd1' 
    WHERE sup_num = ?
  `;

    try {
      const result = await pool.query(query, [sup_num]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateManager: async (sup_num, user_id) => {
    const query = "update supported set user_id = ? where sup_num = ?";

    try {
      const result = await pool.execute(query, [user_id, sup_num]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = service;
