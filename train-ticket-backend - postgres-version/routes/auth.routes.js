const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const authController = require("../controllers/auth.controller");
const otpController = require("../controllers/otp.controller");

// ✅ OTP routes
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

// ✅ Signup using Supabase Auth
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

// ✅ Login using Supabase Auth
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

// ✅ Forgot & Reset Password (Custom controller logic)
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// ✅ Token Verification Route (WORKS IN POSTMAN + Render)
router.get("/verify-token", authController.verifyToken);

module.exports = router;
