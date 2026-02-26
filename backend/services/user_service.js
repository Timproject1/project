const pool = require("../db/mapper");

const service = {
  login: async function (member) {
    try {
      const query = `SELECT * FROM users WHERE user_id=? AND user_pw=?`;
      const result = await pool.query(query, [member.id, member.password]);
      return result[0];
    } catch (error) {
      return null;
    }
  },

  check: async function (id) {
    try {
      const query = `SELECT COUNT(*) AS count FROM users WHERE user_id=?`;
      const result = await pool.query(query, [id]);
      return result[0];
    } catch (error) {
      return { count: 1 };
    }
  },

  signUp: async function (member) {
    try {
      const query = `
        INSERT INTO users 
        (user_id, user_pw, user_name, user_tel, user_email, user_grade, zip_code, address, center_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const result = await pool.query(query, [
        member.id,
        member.password,
        member.name,
        member.tel,
        member.email,
        member.grade,
        member.zipCode,
        member.address,
        member.center,
      ]);
      return result;
    } catch (error) {
      console.error("DB 에러:", error);
      throw error;
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
};

module.exports = service;
