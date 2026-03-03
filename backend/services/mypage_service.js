const pool = require("../db/mapper");

const service = {
  checkPassword: async (user_id, password) => {
    const query = "select user_password from member where user_id = ?";
    const [rows] = await pool.query(query, [user_id]);

    if (rows.length > 0) {
      return rows[0].user_password === password;
    }
    return false;
  },
  getUserInfo: async (user_id) => {
    const query =
      "select user_id, user_name, user_email, user_tel FROM member WHERE user_id = ?";
    const [rows] = await pool.query(query, [user_id]);
    return rows[0];
  },
  updateInfo: async (updateData) => {
    const { user_password, user_email, user_tel, user_id } = updateData;
    const query = `update member set user_password = ?, user_email =?, user_tel=? where user_id = ? `;

    const params = [user_password, user_email, user_tel, user_id];
    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },
};
module.exports = service;
