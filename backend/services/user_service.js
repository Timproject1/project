const pool = require("../db/mapper");

const service = {
  login: async function (member) {
    console.log("ser");
    try {
      const query = `select user_id,user_name,grade,actived,approve,registernum from member where user_id=? and user_password=? and actived="i1"`;
      const result = await pool.query(query, [member.id, member.password]);
      console.log(result);
      // [{},{}]
      return result[0];
    } catch (error) {
      console.log(error);
      return;
    }
  },
  check: async function (id) {
    try {
      const query = `select count(*) as count from member where user_id=?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (error) {
      console.log(error);
      return;
    }
  },
  signUp: async function (member) {
    console.log("signup ser");
    try {
      const query = `insert into member (user_id,registernum,grade,user_password,user_name,user_tel,user_email,actived)
values(?,?,?,?,?,?,?,?);`;
      const result = await pool.query(query, [
        member.id,
        member.center,
        member.grade,
        member.password,
        member.name,
        member.tel,
        member.email,
        "i2",
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  info: async (id) => {
    try {
      const query = `select manager, priority, write_date from documents where user_id=?`;
      const query1 = `select sup_name,sup_reg_date,sup_gender from supported where user_id=? `;
      const result = await pool.query(query, [id]);
      const result1 = await pool.query(query1, [id]);
      return (result[0], result1[0]);
    } catch (err) {
      console.log(err);
      return;
    }
  },
};
module.exports = service;
