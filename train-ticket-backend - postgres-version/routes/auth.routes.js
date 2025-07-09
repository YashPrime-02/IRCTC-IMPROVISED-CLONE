const express = require("express");
const router = express.Router();

// ✅ Controllers
const supabase = require("../utils/supabaseClient");
const authController = require("../controllers/auth.controller");
const otpController = require("../controllers/otp.controller");
const verifyToken = require("../middleware/verifyToken");

// ✅ OTP Routes
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

// ✅ Signup via Supabase Auth
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({
      message: "Signup successful! Please verify your email.",
      user: data.user,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login via Supabase Auth
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: "Invalid credentials" });

    return res.status(200).json({
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Forgot / Reset password (custom Supabase logic)
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// ✅ Protected Route - Token Verification
router.get("/verify-token", verifyToken, (req, res) => {
  return res.status(200).json({
    valid: true,
    user: req.user,
    message: "Token is valid ✅"
  });
});

module.exports = router;
