require("dotenv").config();
const express = require("express");
const pool = require("./db/mapper.js");
const cors = require("cors");
const transporter = require("./util/mail.js");
const app = express();
const user_route = require("./routes/user_router.js");
const center_route = require("./routes/center_router.js");
BigInt.prototype.toJSON = function () {
  return this.toString();
};
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
app.use("/center", center_route);
app.use("/user", user_route); //유저 라우트
app.get("/", async (req, res) => {
  try {
    // res.send("test");
    const query = "show tables";
    const result = await pool.query(query);
    res.json(result);
    // const option = {
    //   from: process.env.MAIL_USER,
    //   to: "jcwoo1213@naver.com",
    //   text: "1234",
    //   subject: "1234",
    // };
    // transporter.sendMail(option, (err, info) => {
    //   if (err) console.log(err);
    // });
    // res.send("test1234");
  } catch (error) {
    console.log(error);
  }
});

app.get("/test", (req, res) => {
  res.send("test");
});
