const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authAdminMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication 123",
        status: "ERROR",
      });
    }
    // console.log("user", user);
    const { payload } = user;
    console.log("user", user);
    if (
      payload?.status == true &&
      payload?.type == "employee" &&
      payload?.role == "admin"
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
module.exports = authAdminMiddleware;
