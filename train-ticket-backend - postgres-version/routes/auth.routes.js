const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient"); // Supabase client
const authController = require("../controllers/auth.controller");
const otpController = require("../controllers/otp.controller");

// ✅ OTP endpoints (signup + forgot password)
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

// ✅ Signup using Supabase Auth
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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

// ✅ Forgot/Reset password handled by your custom controller (optional)
// You can use Supabase reset link instead if needed
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
