const pool = require("../db/mapper");

const service = {
  getList: async function name(filter) {
    console.log("ser");
    console.log(filter);
    try {
      const query = `select registernum,center_name,center_addr,center_tel from center where runed!="g3" and (center_name like "%?%" or center_addr like "%?%")`;
      const result = await pool.query(query, [filter, filter]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
module.exports = service;
