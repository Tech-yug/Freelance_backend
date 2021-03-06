const expressAsyncHandler = require("express-async-handler");
const User = require("../model/user");
const { sendTokenResponse } = require("../utils/utils");

//route GET/api/auth/register
exports.register = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).json({
      message: `User with this email ${email} already exists`,
    });
  }
  user = new User({
    name,
    email,
    password,
  });
  const createUser = await user.save();
  sendTokenResponse(createUser, 200, res);
});

//route POST/api/auth/login
exports.login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .send({ message: "Please make sure you entered a correct email" });
  }

  const comparePassword = await user.matchPassword(password);
  if (!comparePassword) {
    return res.status(401).send({ 
      status: 401,
      success: false,
      message: "Incorrect password" 
    });
  }
  sendTokenResponse(user, 200, res);
});

// route GET/api/auth/logout
exports.logout = expressAsyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Logged out successfully.',
    data: {},
  });
});

//PUT api/auth/updateuser
exports.updateUser = expressAsyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const updatedetails = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );
  sendTokenResponse(updatedetails, 200, res);
});

//PUT api/auth/updatepassword
exports.updatePassword = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const comparePassword = await user.matchPassword(req.body.currentPassword);
  if (!comparePassword) {
    return res.status(401).send({ message: "Password is incorrect" });
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});
