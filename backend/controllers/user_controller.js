const service = require("../services/user_service");
const ctrl = {
  signup: async (req, res) => {
    try {
      const result = await userService.registerUser(req.body);
      return res.status(200).json({ success: true, message: "회원가입 성공" });
    } catch (error) {
      console.error("Signup Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

// 아이디 중복 확인 함수
const checkId = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await userService.check(userId); // 서비스의 check 함수 호출

    // 이미 존재하는 아이디
    if (result.count > 0) {
      return res.status(200).json({ isDuplicate: true });
    } else {
      return res.status(200).json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("CheckID Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 로그인 함수
const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);

    if (result.success) {
      return res.status(200).json({
        success: true,
        user: result.user,
        message: "로그인 성공",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

// 아이디 찾기 함수 추가
const findId = async (req, res) => {
  try {
    const result = await userService.findId(req.body);

    if (result.success) {
      // 아이디 찾기 성공
      return res.status(200).json({
        success: true,
        userId: result.userId,
      });
    } else {
      // 일치하는 정보가 없을 때
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("FindId Controller Error:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

module.exports = {
  signup: signup,
  checkId: checkId,
  login: login,
  findId: findId,
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
