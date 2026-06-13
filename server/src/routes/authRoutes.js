const express = require("express");
const { forgotPassword, login, signup } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
