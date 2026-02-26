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
  writeDoc: async (form_ver, sup_num, user_id, response) => {
    console.log(form_ver);
    console.log(sup_num);
    console.log(user_id);
    console.log(response);

    const con = await pool.getConnection();
    try {
      await con.beginTransaction();
      //신청서 작성
      let query = `insert into documents (doc_num,form_ver,sup_num,user_id) values
      (concat("doc-",NEXT VALUE FOR create_doc_num_seq),?,?,?) RETURNING doc_num`;
      let result = await con.query(query, [form_ver, sup_num, user_id]);
      let wrtiedDoc = result[0].doc_num;
      console.log(wrtiedDoc);
      //응답 버전 기록
      query =
        'insert into doc_version(doc_ver,doc_num,modified_by,`comment`) values(?,?,?,"최초 설문 응답 제출") RETURNING doc_ver';
      result = await con.query(query, [wrtiedDoc + "-1", wrtiedDoc, user_id]);
      console.log(result);
      let doc_ver = result[0].doc_ver;
      for (const question_num in response) {
        let column_name = "";
        if (response[question_num].type == "자유응답형") {
          column_name = "answer_text";
        } else {
          column_name = "select_answer";
        }
        query = `insert into responce (responce_num,doc_ver,question_num,${column_name})
        values(concat("resp-",NEXT VALUE FOR create_responce_num_seq),?,?,?)`;
        await con.query(query, [
          doc_ver,
          question_num,
          response[question_num].response,
        ]);
      }
      // await con.rollback();
      await con.commit();
      return { success: true };
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      con.release();
    }
  },
};
module.exports = service;
