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
  prioritySetting: async (id) => {
    try {
      const query = `insert into priority_req ( priority_req_num, doc_num, priority_reason, priority, priority_app_manager, priority_approved) values (concat("prireq-",NEXT VALUE FOR create_pri_req_num_seq),?,?,?,?,?) `;
      const result = await pool.query(query, [
        id.doc_num,
        id.priority_reason,
        id.priority,
        id.priority_app_manager,
        id.priority_approved,
      ]);
      return result[0];
    } catch (error) {
      console.log(error);
      return;
    }
  },
  priorityApp: async (id) => {
    try {
      const query = `SELECT p.priority_req_num, p.doc_num, p.priority_reason, p.priority, p.priority_approved,d.sup_num
                    FROM priority_req p
                    JOIN documents d ON p.doc_num = d.doc_num
                    WHERE p.priority_req_num = ?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (err) {
      await conn.rollback();
      console.log(err);
      return;
    }
  },
  appPriority: async (id) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(`update documents set priority=? where doc_num = ?; `, [
        id.priority,
        id.doc_num,
      ]);
      await conn.query(`delete from priority_req where priority_req_num = ?`, [
        id.priority_req_num,
      ]);
      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      console.log(err);
      return;
    } finally {
      conn.release();
    }
  },
  returnPriority: async (id) => {
    try {
      const query = `update priority_req set priority_return_reason=?,priority_approved=? where priority_req_num = ?`;
      const result = await pool.query(query, [
        id.priority_return_reason,
        id.priority_approved,
        id.priority_req_num,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  addrecord: async (id) => {
    try {
      const query = `insert into counsels (counsel_num, doc_num, counsel_title, counsel_content, counsel_manager)
                    values (concat("coun-",NEXT VALUE FOR create_counsel_num_seq),?,?,?,?);`;
      const result = await pool.query(query, [
        id.doc_num,
        id.counsel_title,
        id.counsel_content,
        id.counsel_manager,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  recordList: async () => {
    try {
      const query = `select  ROW_NUMBER() OVER(ORDER BY counsel_num ASC) AS row_num,counsel_num,doc_num,counsel_date,counsel_title,counsel_content,counsel_manager from counsels order by row_num DESC`;
      const result = await pool.query(query);
      return result;
    } catch (err) {
      console.log(err);
      return;
    }
  },
  modifyRecordList: async (id) => {
    try {
      const query = `select counsel_modifi_num,counsel_num,counsel_modified_by,counsel_modified_date,counsel_modified_comment,counsel_modified_title,counsel_modified_content
                    from counsel_modifi where counsel_num = ?`;
      const result = await pool.query(query, [id]);
      return result;
    } catch (err) {
      console.log(err);
      return;
    }
  },
  saveRecord: async (id) => {
    try {
      const query = `insert into counsel_draft (counsel_num,doc_num,counsel_title,counsel_content,counsel_dissavedate)
                    values(?,?,?,?,DATE_ADD(CURDATE(), INTERVAL 30 DAY));`;
      const result = await pool.query(query, [
        id.counsel_num,
        id.doc_num,
        id.counsel_title,
        id.counsel_content,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  saveRecordBring: async () => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query(
        `select counsel_num, counsel_title,counsel_content from counsel_draft`,
      );

      await conn.query(`delete from counsel_draft where counsel_num=?`, [
        "coun-9999999",
      ]);

      await conn.commit();
      return [rows];
    } catch (err) {
      await conn.rollback();
      console.log(err);
      return;
    } finally {
      conn.release();
    }
  },
  UpdateRecord: async (id) => {
    try {
      const query = `update counsels set counsel_title=?,counsel_content=? where counsel_num=?`;
      const result = await pool.query(query, [
        id.counsel_title,
        id.counsel_content,
        id.counsel_num,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  addplan: async (id) => {
    try {
      const query = `insert into plans (plan_num, doc_num,  plan_approved, plan_manager, plan_title, plan_content)
                    values (concat("plan-",NEXT VALUE FOR create_plan_num_seq),?,?,?,?,?);`;
      const result = await pool.query(query, [
        id.doc_num,
        id.plan_approved,
        id.plan_manager,
        id.plan_title,
        id.plan_content,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  planList: async () => {
    try {
      const query = `select ROW_NUMBER() OVER(ORDER BY plan_num ASC) AS row_num, plan_num, doc_num, plan_date, plan_req_date, plan_approved, plan_manager, plan_title, plan_content,plan_return_reason
                      from plans order by row_num DESC`;
      const result = await pool.query(query);
      return result;
    } catch (err) {
      console.log(err);
      return;
    }
  },
  savePlan: async (id) => {
    try {
      const query = `insert into plan_draft (plan_num,doc_num,plan_title,plan_content,plan_dissavedate)
                    values(?,?,?,?,DATE_ADD(CURDATE(), INTERVAL 30 DAY));`;
      const result = await pool.query(query, [
        id.plan_num,
        id.doc_num,
        id.plan_title,
        id.plan_content,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  savePlanBring: async () => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query(
        `select plan_num, plan_title,plan_content from plan_draft`,
      );

      await conn.query(`delete from plan_draft where plan_num=?`, [
        "plan-9999999",
      ]);

      await conn.commit();
      return [rows];
    } catch (err) {
      await conn.rollback();
      console.log(err);
      return;
    } finally {
      conn.release();
    }
  },
  appPlan: async (id) => {
    try {
      const query = `update plans set plan_approved="d2",plan_app_date=current_date where plan_num=?`;
      const result = await pool.query(query, [id.plan_num]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  returnPlan: async (id) => {
    try {
      const query = `update plans set plan_approved="d3",plan_return_reason=? where plan_num=?`;
      const result = await pool.query(query, [
        id.plan_return_reason,
        id.plan_num,
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
  restartPlan: async (id) => {
    try {
      const query = `update plans set plan_approved="d1" where plan_num=?`;
      const result = await pool.query(query, [id.plan_num]);
      return result[0];
    } catch (err) {
      console.log(err);
      return;
    }
  },
};
module.exports = service;
