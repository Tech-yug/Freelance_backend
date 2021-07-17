const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/tokenResponse");
const sendEmail = require("../utils/sendEmail");

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

  const token = user.generateToken();

  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/confirmation/${token}`;

  await sendEmail({
    email: user.email,
    subject: "Email Confirmation",
    html: `<h1> Hello ${user.name} </h1>
           <h2>Please confirm your email by clicking on the following link </h2>
           <a href=${url}> Click here</a>`,
  });

  res.status(200).json({
    message: "Please verify your email to proceed further",
  });
});

//route POST/api/auth/confirmation/:token
exports.verifyEmail = expressAsyncHandler(async (req, res) => {
  const token = req.params.token;

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(id, { verified: true });
    if (!user) {
      res.status(401).json({
        message: "User not found for this verification.Please SignUp!",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid token. Your verification link may have expired.",
    });
  }
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
    return res.status(401).json({ message: "Incorrect password" });
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
    return res.status(401).json({ message: "Password is incorrect" });
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

//POST api/auth/forgetpassword
exports.forgetPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: `The user with this email ${email} dosenot exist` });
  }

  const otpCode = user.generateOtp();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Verification code",
      html: `<h1>Hello ${user.name}</h1>
             <p>You are receiving this email because you have requested the reset of your password.</p>
             <h2>verification code:  ${otpCode}</h2>`,
    });
    res.status(200).json({ message: "Please check your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Email could not be sent" });
  }
});

//PUT api/auth/resetpassword
exports.resetPassword = expressAsyncHandler(async (req, res) => {
  const { otpCode } = req.body;
  const user = await User.findOne({
    otpCode,
    otpCodeExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid otp" });
  }
  user.password = req.body.password;
  await user.save();
  sendTokenResponse(user, 200, res);
});
