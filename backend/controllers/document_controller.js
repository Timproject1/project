const service = require("../services/document_service");
const ctrl = {
  getList: async (req, res) => {
    console.log(req.query);
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
      console.log("contr");
      console.log(result);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  getForm: async (req, res) => {
    try {
      const { ver, form } = await service.getForm();

      const result = form.reduce((acc, row) => {
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
          });
        }

        return acc;
      }, []);

      res.json({ retCode: "OK", ver: ver.form_ver, form: result });
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
      console.log(req.body);
      const result = await service.writeDoc(form_ver, sup_num, response);
      res.json({ retCode: "OK", result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG", error });
    }
  },
  prioritySetting: async (req, res) => {
    const priority = req.body;
    try {
      const result = await service.prioritySetting(priority);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  priorityApp: async (req, res) => {
    const priority = req.params.id;
    try {
      const result = await service.priorityApp(priority);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  appPriority: async (req, res) => {
    const priority = req.body;
    try {
      const result = await service.appPriority(priority);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  returnPriority: async (req, res) => {
    const returnPri = req.body;
    try {
      const result = await service.returnPriority(returnPri);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  addrecord: async (req, res) => {
    const add = req.body;
    try {
      const result = await service.addrecord(add);
      // console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  recordList: async (req, res) => {
    const list = req.params.id;
    try {
      const result = await service.recordList(list);
      console.log(result);
      res.json({ result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  modifyRecordList: async (req, res) => {
    const list = req.params.id;
    try {
      const result = await service.modifyRecordList(list);
      console.log(result);
      res.json({ result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  saveRecord: async (req, res) => {
    const save = req.body;
    try {
      const result = await service.saveRecord(save);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  saveRecordBring: async (req, res) => {
    const bring = req.body;
    try {
      const result = await service.saveRecordBring(bring);
      console.log(result);
      res.json({ result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  UpdateRecord: async (req, res) => {
    const update = req.body;
    try {
      const result = await service.UpdateRecord(update);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  addplan: async (req, res) => {
    const add = req.body;
    try {
      const result = await service.addplan(add);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  planList: async (req, res) => {
    const list = req.params.id;
    try {
      const result = await service.planList(list);
      // console.log(result);
      res.json({ result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  savePlan: async (req, res) => {
    const save = req.body;
    try {
      const result = await service.savePlan(save);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  savePlanBring: async (req, res) => {
    const bring = req.body;
    try {
      const result = await service.savePlanBring(bring);
      // console.log(result);
      res.json({ result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  appPlan: async (req, res) => {
    const app = req.body;
    try {
      const result = await service.appPlan(app);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  returnPlan: async (req, res) => {
    const returnplan = req.body;
    try {
      const result = await service.returnPlan(returnplan);
      console.log(result);
      res.json({ retCode: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
  restartPlan: async (req, res) => {
    const restartplan = req.body;
    try {
      const result = await service.restartPlan(restartplan);
      console.log(result);
      res.json({ result });
    } catch (error) {
      console.log(error);
      res.json({ retCode: "NG" });
    }
  },
};
module.exports = ctrl;
