const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const otpController = require("../controllers/otp.controller");

// ✅ OTP endpoints (signup + forgot password)
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

// ✅ Auth endpoints
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
