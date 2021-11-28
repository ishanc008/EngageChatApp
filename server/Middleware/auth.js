const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const secret = process.env.SECRET;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log("token expired");
    res.status(400).json({ message: "Token expired" });
  }
};

module.exports = auth;
