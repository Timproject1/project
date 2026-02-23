const pool = require("../db/mapper");

const service = {
  login: async function name(member) {
    console.log("ser");
    try {
      const query = `select user_id,user_name,grade,actived,approve from member where user_id=? and user_password=? and actived="i1"`;
      const result = await pool.query(query, [member.id, member.password]);
      console.log(result);
      return result[0];
    } catch (error) {
      console.log(error);
      return;
    }
  },
  check: async function name(id) {
    try {
      const query = `select count(*) as count from member where user_id=?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
module.exports = service;
