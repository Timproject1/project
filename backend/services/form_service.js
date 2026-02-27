const pool = require("../db/mapper");

const service = {
  getList: async (id) => {
    try {
      console.log("ser");
      console.log(id);
      const query = `select form_ver,writedate,ifnull(begindate,"미사용") as begindate,
      if(enddate is null ,if(begindate is null,'미사용','사용중'),enddate) as enddate,
      \`comment\`,
      c.detail_name as 'usage'
      from form_version f
      join code_detail c
      on f.\`usage\`=c.detail_code`;
      const result = await pool.query(query);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  writeForm: async (form) => {
    for (const big of form) {
      console.log(big);
      for (const small of big.scategory) {
        console.log(small);
        for (const question of small.questions) {
          console.log(question);
        }
      }
    }
  },
  usageForm: async () => {
    try {
      const query1 = `select bcategory,scategory,question,response,number,value,question_num,exam_num,form_ver from getForm
      where form_ver in (select form_ver from form_version where \`usage\`='h1')`;
      const form = await pool.query(query1);
      return form;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getForm: async (num) => {
    try {
      let query = `select bcategory,scategory,question,response,number,value,question_num,exam_num,form_ver from getForm where form_ver=?`;
      const result = await pool.query(query, [num]);
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
module.exports = service;
