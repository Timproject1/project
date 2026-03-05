const pool = require("../db/mapper");

const service = {
  // 마이페이지 접속 전 본인확인 부분 (비밀번호 재입력)
  checkPassword: async (user_id, password) => {
    const query = "select user_password from member where user_id = ?";
    const rows = await pool.query(query, [user_id]);

    if (rows && rows.length > 0) {
      return rows[0].user_password === password;
    }
    return false;
  },
  getUserInfo: async (user_id) => {
    if (!user_id || user_id === "null") return null; // 아이디가 없으면 즉시 종료
    const query =
      "SELECT user_id, user_name, user_email, user_tel FROM member WHERE user_id = ?";
    const rows = await pool.query(query, [user_id]);
    return rows.length > 0 ? rows[0] : null;
  },
  updateInfo: async (updateData) => {
    const { user_password, user_email, user_tel, user_id } = updateData;
    const query = `update member set user_password = ?, user_email =?, user_tel=? where user_id = ? `;

    const params = [user_password, user_email, user_tel, user_id];
    const result = await pool.query(query, params);
    return result.affectedRows > 0;
  },
  // 1. 일반 회원 승인 신청 목록 조회
  getPendingUsers: async () => {
    // user_status가 '0'(승인대기)인 회원만 조회
    const query =
      "SELECT user_id, user_name, user_email, user_reg_date, user_tel FROM member WHERE approve = 'k2' ORDER BY user_reg_date ASC";
    const rows = await pool.query(query);
    return rows;
  },

  // 2. 일반 회원 승인 처리 (상태 변경)
  approveUser: async (user_id) => {
    // user_status를 '1'(승인완료)로 변경
    console.log(`${user_id}`);
    const query = "UPDATE member SET approve = 'k1' WHERE user_id = ?";
    const result = await pool.query(query, [user_id]);
    return result.affectedRows > 0;
  },
};
module.exports = service;
