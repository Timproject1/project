const { getResp } = require("../controllers/document_controller");
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
      return error;
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
  writeDoc: async (form_ver, sup_num, user_id, response) => {
    // console.log(form_ver);
    // console.log(sup_num);
    // console.log(user_id);
    // console.log(response);

    const con = await pool.getConnection();
    try {
      //중간에 에러나면 다 돌리기 위해 트랜잭션으로 진행
      await con.beginTransaction();
      //신청서 작성하고, 작성된 신청서 번호 받아오기
      let query = `insert into documents (doc_num,form_ver,sup_num,user_id) values
      (concat("doc-",NEXT VALUE FOR create_doc_num_seq),?,?,?) RETURNING doc_num`;
      let result = await con.query(query, [form_ver, sup_num, user_id]);
      let wrtiedDoc = result[0].doc_num;
      // console.log(wrtiedDoc);
      //응답 버전 기록하고, 버전넘버 받아오기
      query =
        'insert into doc_version(doc_ver,doc_num,modified_by,`comment`) values(?,?,?,"최초 설문 응답 제출") RETURNING doc_ver';
      result = await con.query(query, [wrtiedDoc + "-1", wrtiedDoc, user_id]);
      // console.log(result);
      let doc_ver = result[0].doc_ver;
      for (const question_num in response) {
        let column_name = "";
        //응답방식에 따라 들어가는 칼럼명이 다름
        if (response[question_num].type == "자유응답형") {
          column_name = "answer_text";
        } else {
          column_name = "select_answer";
        }
        //칼럼명은 ? 사용불가
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
  getDoc: async (num) => {
    try {
      let query = `select doc_num,sup_name,writer_name,write_date,manager_name,progress,form_ver from getDocumentList where doc_num=?`;
      const result = await pool.query(query, [num]);
      // console.log(result);
      return result;
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
  getResp: async (num) => {
    try {
      const query = `select responce_num,doc_ver,question_num,select_answer,answer_text from responce 
      where doc_ver = (select doc_ver from recent_doc_ver where doc_num=? )`;
      const result = await pool.query(query, [num]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
module.exports = service;
