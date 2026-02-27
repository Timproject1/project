require("dotenv").config();
const express = require("express");
const pool = require("./db/mapper.js");
const cors = require("cors");
const app = express();
const user_route = require("./routes/user_router.js");
const center_route = require("./routes/center_router.js");
const doc_route = require("./routes/document_router.js");
const sup_route = require("./routes/support_router.js");
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/center", center_route); //센터 라우트
app.use("/user", user_route); //유저 라우트
app.use("/document", doc_route);
app.use(["/support", "/supported"], sup_route);
app.get("/", async (req, res) => {
  try {
    const query = "show tables";
    const result = await pool.query(query);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/test", (req, res) => {
  res.send("test server is running!");
});

// 서버 시작은 맨 마지막에!
app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
