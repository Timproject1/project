const pool = require("../db/mapper");

const service = {
  getList: async (id) => {
    try {
      const query = `select sup_num,sup_name from supported where user_id= ? `;
      const result = await pool.query(query, [id]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = service;
