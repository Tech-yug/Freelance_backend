const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  let token;
  if (authorization) {
    token = authorization.slice(7, authorization.length);
  }

  if (!token) {
    return res
      .status(401)
      .send({ message: "Not Authorized to access this route" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Not Authorized to access this route" });
  }
};
