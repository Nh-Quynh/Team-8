const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// const authAdminMiddleWare = (req, res, next) => {
//   console.log("CheckToken", req.headers.token);
//   const token = req.headers.token.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//     if (err) {
//       return res.status(404).json({
//         message: "The authentication",
//         status: "ERROR",
//       });
//     }
//     console.log("User", user);
//     const { payload } = user;

//     if (payload?.role == "admin") {
//       next();
//     } else {
//       return res.status(404).json({
//         message: "The authentication",
//         status: "ERROR",
//       });
//     }
//   });
// };

const authUserMiddleWare = (req, res, next) => {
  // console.log("CheckToken", req.headers.token);
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }

    const { payload } = user;
    // console.log("Payload", payload);
    if (
      payload?.id == userId ||
      (payload?.type == "employee" && payload?.role == "admin")
    ) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

module.exports = authUserMiddleWare;
