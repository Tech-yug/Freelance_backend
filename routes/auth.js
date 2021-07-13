const express = require("express");
const {
  register,
  login,
  logout,
  updateUser,
  updatePassword,
} = require("../controllers/auth");
const router = express.Router();
const { isAuth } = require("../middleware/auth");

router
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout)
  .put("/updateuser", isAuth, updateUser)
  .put("/updatepassword", isAuth, updatePassword);

module.exports = router;
