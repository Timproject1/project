const mysql = require("mysql2/promise");
require("dotenv").config();

// 1. DB 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "dev", // 사용 중인 DB 이름

  // [최적화 설정]
  waitForConnections: true, // 연결이 꽉 찼을 때 대기 여부
  connectionLimit: 10, // 동시에 유지할 최대 연결 수
  queueLimit: 0, // 대기 줄 제한 없음
  connectTimeout: 10000, // 10초 동안 연결 안 되면 실패 처리
  enableKeepAlive: true, // 유휴 상태일 때 연결 유지 (벽돌 방지)
  keepAliveInitialDelay: 10000, // 10초마다 연결 상태 확인
};

const pool = mysql.createPool(dbConfig);

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("-----------------------------------------");
    console.log("MySQL DB 연결 성공 (Host: " + dbConfig.host + ")");
    console.log("-----------------------------------------");
    conn.release();
  } catch (err) {
    console.error("-----------------------------------------");
    console.error("MySQL DB 연결 실패");
    console.error("사유:", err.message);
    console.error("TIP: .env 파일의 정보나 DB 서버 상태를 확인하세요.");
    console.log("-----------------------------------------");
  }
})();

pool.on("error", (err) => {
  console.error("DB 풀에서 예기치 못한 에러 발생:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("DB 연결이 유실되었습니다.");
  }
});

module.exports = pool;
