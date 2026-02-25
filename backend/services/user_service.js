const pool = require("../db/mapper");

const service = {
  login: async function (member) {
    try {
      const query = `SELECT * FROM users WHERE user_id=? AND user_pw=?`;
      const result = await pool.query(query, [member.id, member.password]);
      return result[0];
    } catch (error) {
      return null;
    }
  },

  check: async function (id) {
    try {
      const query = `SELECT COUNT(*) AS count FROM users WHERE user_id=?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (error) {
      return { count: 1 };
    }
  },

  signUp: async function (member) {
    try {
      const query = `
        INSERT INTO users 
        (user_id, user_pw, user_name, user_tel, user_email, user_grade, zip_code, address, center_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const result = await pool.query(query, [
        member.id,
        member.password,
        member.name,
        member.tel,
        member.email,
        member.grade,
        member.zipCode,
        member.address,
        member.center,
      ]);
      return result;
    } catch (error) {
      console.error("DB 에러:", error);
      throw error;
    }
  }, // <--- 여기도 쉼표 확인!

  info: async function (id) {
    try {
      const query = `SELECT * FROM users WHERE user_id = ?`;
      const [rows] = await pool.query(query, [id]);
      return rows[0];
    } catch (err) {
      return null;
    }
  },
};

module.exports = service;
