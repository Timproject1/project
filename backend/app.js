require("dotenv").config();
const express = require("express");
const pool = require("./db/mapper.js");
const transporter = require("./util/mail.js");
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

app.get("/", async (req, res) => {
  try {
    // const result = await pool.query(query);
    // res.json(result);
    const option = {
      from: process.env.MAIL_USER,
      to: "jcwoo1213@naver.com",
      text: "1234",
      subject: "1234",
    };
    transporter.sendMail(option, (err, info) => {
      if (err) console.log(err);
    });
    res.send("test1234");
  } catch (error) {
    console.log(error);
  }
});

app.get("/test", (req, res) => {
  res.send("test");
});
