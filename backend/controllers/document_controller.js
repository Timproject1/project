const service = require("../services/document_service");
const reducing = (array) => {
  return array.reduce((acc, row) => {
    // 1. 대분류(Big Category) 처리
    let big = acc.find((b) => b.bcategory === row.bcategory);
    if (!big) {
      big = {
        bcategory: row.bcategory,
        scategory: [],
      };
      acc.push(big);
    }

    // 2. 소분류(Small Category) 처리
    let small = big.scategory.find((s) => s.scategory === row.scategory);
    if (!small) {
      small = {
        scategory: row.scategory,
        questions: [],
      };
      big.scategory.push(small);
    }

    // 3. 질문(Question) 처리
    let question = small.questions.find(
      (q) => q.question_num === row.question_num,
    );
    if (!question) {
      question = {
        question_num: row.question_num,
        question: row.question,
        response: row.response,
        options: [],
      };
      small.questions.push(question);
    }

    // 4. 보기(Options) 처리 (객관식일 경우에만)
    if (row.number) {
      question.options.push({
        number: row.number,
        value: row.value,
        exam_num: row.exam_num,
      });
    }

    return acc;
  }, []);
};
const ctrl = {
  getList: async (req, res) => {
    // console.log(req.query);
    const info = {
      id: req.query.id ? req.query.id : "",
      centerCode: req.query.centerCode ? req.query.centerCode : "",
      grade: req.query.grade ? req.query.grade : "",
    };
    const filter = {
      writer_name: req.query.writer ? req.query.writer : "",
      maneger_name: req.query.maneger ? req.query.maneger : "",
      sup_name: req.query.sup ? req.query.sup : "",
    };
    try {
      const result = await service.getList(info, filter);
      // console.log("contr");
      // console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  usageForm: async (req, res) => {
    try {
      const result = await service.usageForm();
      // console.log(result);
      const retVal = reducing(result);

      res.json({ retCode: "OK", ver: result[0].form_ver, form: retVal });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG", error });
    }
  },
  writeDoc: async (req, res) => {
    try {
      const form_ver = req.body.formVer;
      const sup_num = req.body.sup_num;
      const response = req.body.response;
      const user_id = req.body.user_id;
      // console.log(req.body);
      const result = await service.writeDoc(
        form_ver,
        sup_num,
        user_id,
        response,
      );
      if (result.success) {
        res.json({ retCode: "OK", result });
      } else {
        res.json({ retCode: "NG", error: result });
      }
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG", error });
    }
  },
  getDoc: async (req, res) => {
    const num = req.params.num;
    // console.log(num);
    try {
      const result = await service.getDoc(num);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  getForm: async (req, res) => {
    const num = req.params.num;
    // console.log(num);
    try {
      const result = await service.getForm(num);
      // console.log("contr");
      // console.log(result);
      const retVal = reducing(result);
      res.json({ retCode: "OK", form: retVal });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  getResp: async (req, res) => {
    const num = req.params.num;
    console.log(num);
    try {
      const result = await service.getResp(num);
      const retVal = {};
      for (const row of result) {
        retVal[row.question_num] = row.select_answer
          ? row.select_answer
          : row.answer_text;
      }
      res.json({ retCode: "OK", response: retVal });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
