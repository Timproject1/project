const pool = require("../db/mapper");

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
};
module.exports = service;
