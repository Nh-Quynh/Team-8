const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const generalAccessToken = async (payload) => {
  console.log("payload", payload);
  const accessToken = jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "30s" }
  );
  return accessToken;
};
const generalRefreshToken = async (payload) => {
  const refreshToken = jwt.sign(
    {
      payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return refreshToken;
};
const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("token", token);
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          return res.status(404).json({
            status: "ERROR",
            message: "The authentication",
          });
        }
        const { payload } = user;
        const accessToken = await generalAccessToken({
          id: payload.id,
          type: payload.type,
          status: payload.status,
          role: payload.role,
        });
        console.log("accessToken", accessToken);
        resolve({
          status: "OK",
          message: "SUCCESS",
          accessToken,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService,
};
