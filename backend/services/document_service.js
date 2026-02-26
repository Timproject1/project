const pool = require("../db/mapper");

const service = {
  getList: async (info, searchFilters) => {
    try {
      let query = `select doc_num,sup_name,writer_name,write_date,manager_name,progress from getDocumentList`;
      const conditions = [];
      const values = [];
      if (info.grade == "a1") {
        conditions.push("writer_id = ?");
        values.push(info.id);
      }
      if (info.grade == "a2" || info.grade == "a3") {
        conditions.push("registernum = ?");
        values.push(info.centerCode);
      }

      for (const key in searchFilters) {
        if (!searchFilters[key]) continue;

        conditions.push(`${key} = ?`);
        values.push(searchFilters[key]);
      }
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      const result = await pool.query(query, values);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  getForm: async () => {
    try {
      const query = 'select form_ver from form_version where `usage`="h1"';
      const ver = await pool.query(query);
      const query1 = `select bcategory,scategory,question,response,number,value,question_num,exam_num from getForm`;
      const form = await pool.query(query1);
      return { ver: ver[0], form };
    } catch (error) {
      console.log(error);
    }
  },
  writeDoc: async () => {},
};
module.exports = service;
