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
  },
  prioritySetting: async (id) => {
    try {
      const query = `insert into priority_req ( priority_req_num, doc_num, priority_reason, priority, priority_app_manager, priority_approved) values (?,?,?,?,?,?) `;
      const result = await pool.query(query, [
        id.priority_req_num,
        id.doc_num,
        id.priority_reason,
        id.priority,
        id.priority_app_manager,
        id.priority_approved,
      ]);
      return result[0];
    } catch (error) {
      console.log(error);
      return;
    }
  },
  priorityApp: async (id) => {
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

module.exports = service;
