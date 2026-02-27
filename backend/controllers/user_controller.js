const service = require("../services/user_service");

const checkId = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log("받은 아이디:", user_id);

    const result = await service.check(user_id);

    if (result && result.count > 0) {
      return res.status(200).json({ isDuplicate: true });
    } else {
      return res.status(200).json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("CheckID Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const findId = async (req, res) => {
  try {
    const result = await service.findId(req.body);

    if (result.success) {
      return res.status(200).json({ success: true, userId: result.userId });
    } else {
      return res.status(200).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("FindId Controller Error:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

const signup = async (req, res) => {};
const login = async (req, res) => {};

module.exports = {
  signup,
  checkId,
  login,
  findId,
};
  },
//   appPriority: async (req, res) => {
//     console.log(req.body);
//     const priority = req.body;
//     try {
//       const result = await service.appPriority(priority);
//       console.log(result);
//       res.json({ retCode: "OK" });
//     } catch (error) {
//       console.log(error);
//       res.json({ retCode: "NG" });
//     }
//   },
//   returnPriority: async (req, res) => {
//     console.log(req.body);
//     const returnPri = req.body;
//     try {
//       const result = await service.returnPriority(returnPri);
//       console.log(result);
//       res.json({ retCode: "OK" });
//     } catch (error) {
//       console.log(error);
//       res.json({ retCode: "NG" });
//     }
//   },
//   addrecord: async (req, res) => {
//     console.log(req.body);
//     const add = req.body;
//     try {
//       const result = await service.addrecord(add);
//       console.log(result);
//       res.json({ retCode: "OK" });
//     } catch (error) {
//       console.log(error);
//       res.json({ retCode: "NG" });
//     }
//   },
//   recordList: async (req, res) => {
//     const list = req.params.id;
//     try {
//       const result = await service.recordList(list);
//       console.log(result);
//       res.json({ result });
//     } catch (error) {
//       console.log(error);
//       res.json({ retCode: "NG" });
//     }
//   },
//   modifyRecordList: async (req, res) => {
//     console.log(req.params.id);
//     const list = req.params.id;
//     try {
//       const result = await service.modifyRecordList(list);
//       console.log(result);
//       res.json({ result });
//     } catch (error) {
//       console.log(error);
//       res.json({ retCode: "NG" });
//     }
//   },
//   saveRecord: async (req, res) => {
//     console.log(req.body);
//     const save = req.body;
//     try {
//       const result = await service.saveRecord(save);
//       console.log(result);
//       res.json({ retCode: "OK" });
//     } catch (error) {
//       console.log(error);
//       res.json({ retCode: "NG" });
//     }
//   },
// };

// module.exports = ctrl;
