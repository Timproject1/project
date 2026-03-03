const pool = require("../db/mapper");

const service = {
  // 아이디 중복 확인
  check: async function (id) {
    try {
      console.log("받은 아이디:", id);
      const query = `SELECT COUNT(*) AS count FROM member WHERE user_id = ?`;

      const rows = await pool.query(query, [id]);

      console.log("DB 확인 결과:", rows[0]);
      return rows[0];
    } catch (error) {
      console.error("중복 확인 서비스 에러:", error);
      throw error;
    }
  },

  // 회원가입
  signUp: async function (member) {
    try {
      console.log("가입 요청 데이터 상세:", member);
      const query = `
        INSERT INTO member 
        (user_id, user_password, user_name, user_tel, user_email, registernum, grade, actived)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        member.user_id || null,
        member.user_password || null,
        member.user_name || null,
        member.user_tel || null,
        member.user_email || null,
        member.registernum || null,
        member.grade || "a1",
        member.actived || "i1",
      ];

      const result = await pool.query(query, params);

      console.log("가입 완료! 결과:", result);
      return { success: true, result };
    } catch (error) {
      console.error("회원가입 서비스 에러 상세:", error.message);
      throw error;
    }
  },

  // 로그인
  login: async function (id, pw) {
    try {
      const query = `SELECT * FROM member WHERE user_id = ? AND user_password = ?`;
      const rows = await pool.query(query, [id, pw]);

      if (rows && rows.length > 0) {
        return rows[0];
      }
      return null;
    } catch (error) {
      console.error("로그인 서비스 에러:", error);
      throw error;
    }
  },

  // 아이디 찾기
  findId: async function (name, email) {
    try {
      const query = `SELECT user_id FROM member WHERE user_name = ? AND user_email = ?`;
      const rows = await pool.query(query, [name, email]);

      if (rows && rows.length > 0) {
        return rows[0].user_id;
      }
      return null;
    } catch (error) {
      console.error("아이디 찾기 서비스 에러:", error);
      throw error;
    }
  },
};

module.exports = service;
