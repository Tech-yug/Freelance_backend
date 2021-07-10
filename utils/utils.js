//create cookie
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};
