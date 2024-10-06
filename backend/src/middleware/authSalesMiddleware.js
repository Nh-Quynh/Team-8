const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authSalesMiddleware = (req, res, next) => {
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
    if (
      payload?.type == "employee" &&
      payload?.role == "sales" &&
      payload?.status == true
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
module.exports = authSalesMiddleware;
