const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authUserMiddleWare = (req, res, next) => {
  console.log("CheckToken", req.headers.token);
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
    if (payload?.role === "admin" || payload?._id === userId) {
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
