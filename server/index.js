const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // JSON 데이터를 읽기 위해 반드시 필요!

// MySQL 연결 설정 (본인의 정보로 수정 확인!)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password", // 실제 비밀번호로 수정하세요
  database: "test_db", // 실제 DB 이름으로 수정하세요
});

// 회원가입 API
app.post("/api/signup", (req, res) => {
  // 1. 프론트에서 데이터가 오는지 서버 터미널에 출력
  console.log("---------------------------");
  console.log("프론트에서 온 데이터:", req.body);
  console.log("---------------------------");

  const {
    userId,
    userPw,
    userName,
    userTel,
    userEmail,
    userAddress,
    detailAddress,
    centerName,
  } = req.body;

  // 2. 데이터가 하나라도 비어있는지 확인
  if (!userId || !userPw) {
    return res.json({
      success: false,
      message: "아이디나 비밀번호가 서버로 전달되지 않았습니다 (null)",
    });
  }

  const sql = `INSERT INTO users (user_id, user_pw, user_name, user_tel, user_email, address, detail_address, center_name) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      userId,
      userPw,
      userName,
      userTel,
      userEmail,
      userAddress,
      detailAddress,
      centerName,
    ],
    (err, result) => {
      if (err) {
        console.error("DB 저장 에러:", err);
        return res
          .status(500)
          .json({ success: false, message: "DB 저장 실패", error: err });
      }
      res.json({ success: true, message: "회원가입 성공! DB를 확인하세요." });
    },
  );
});

app.listen(3000, () => console.log("서버가 3000번 포트에서 가동 중입니다."));
