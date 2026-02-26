const pool = require("../db/mapper");

const service = {
  // 로그인 함수
  login: async function (member) {
    try {
      const query = `SELECT * FROM users WHERE user_id=? AND user_pw=?`;
      const result = await pool.query(query, [
        member.id || member.userId,
        member.password || member.userPw,
      ]);

      if (result && result.length > 0) {
        return {
          success: true,
          user: result[0],
        };
      } else {
        return {
          success: false,
          message: "아이디 또는 비밀번호가 틀렸습니다.",
        };
      }
    } catch (error) {
      console.error("Login DB Error:", error);
      return { success: false, message: "DB 연결 오류" };
    }
  },

  // 아이디 찾기 함수
  findId: async function (member) {
    try {
      const query = `SELECT user_id FROM users WHERE user_name = ? AND user_email = ?`;
      const result = await pool.query(query, [
        member.userName,
        member.userEmail,
      ]);

      if (result && result.length > 0) {
        return {
          success: true,
          userId: result[0].user_id,
        };
      } else {
        return {
          success: false,
          message: "일치하는 정보가 없습니다.",
        };
      }
    } catch (error) {
      console.error("FindId DB Error:", error);
      return { success: false, message: "DB 오류 발생" };
    }
  },

  // 아이디 중복 확인
  check: async function (id) {
    try {
      const query = `SELECT COUNT(*) AS count FROM users WHERE user_id=?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (error) {
      return { count: 1 };
    }
  },

  //  회원가입
  signUp: async function (member) {
    try {
      const query = `
        INSERT INTO users 
        (user_id, user_pw, user_name, user_tel, user_email, address, detail_address, center_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        member.userId || member.id || null,
        member.userPw || member.password || null,
        member.userName || member.name || null,
        member.userTel || member.tel || null,
        member.userEmail || member.email || null,
        member.userAddress || member.address || null,
        member.addrDetail || member.detailAddress || "",
        member.centerName || member.center || "",
      ];

      const result = await pool.query(query, params);
      return result;
    } catch (error) {
      console.error("DB 에러 상세:", error);
      throw error;
    }
  },

  // 유저 정보 조회
  info: async function (id) {
    try {
      const query = `select priority_req_num, priority_reason, priority from priority_req where priority_req_num =?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (err) {
      console.log(error);
      return;
    }
  },
};

module.exports = {
  ...service,
  registerUser: service.signUp,
};
