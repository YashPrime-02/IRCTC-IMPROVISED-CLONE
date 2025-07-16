const express = require("express");
const router = express.Router();

// ✅ Controllers & Utilities
const supabase = require("../utils/supabaseClient");
const authController = require("../controllers/auth.controller");
const otpController = require("../controllers/otp.controller");
const verifyToken = require("../middleware/verifyToken");

// ✅ OTP Routes
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

// ✅ Signup via Supabase Auth + Insert into `users` table
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  console.log("📥 Signup request received:", req.body);

  try {
    // Step 1: Sign up using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name } // stored in raw_user_meta_data
      }
    });

    if (authError) {
      console.error("❌ Supabase signup error:", authError.message);
      return res.status(400).json({ error: authError.message });
    }

    const authUser = authData?.user;

    // Step 2: Insert into `users` table
    const { error: dbError } = await supabase
      .from("users")
      .insert([
        {
          id: authUser.id,     // same ID as Supabase Auth
          name,
          email,
          password             // 🔐 Not secure in production (hash if needed)
        }
      ]);

    if (dbError) {
      console.warn("⚠️ User created in Auth but not in users table:", dbError.message);
      return res.status(201).json({
        message: "Signup succeeded (Auth only). DB insert failed.",
        user: authUser,
        warning: dbError.message
      });
    }

    console.log("✅ User inserted in users table:", email);
    return res.status(201).json({
      message: "Signup successful! Please verify your email.",
      user: authUser
    });
  } catch (err) {
    console.error("🔥 Internal signup error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login via Supabase Auth
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Login attempt:", email);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn("❌ Login failed for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ User logged in:", data.user.email);
    return res.status(200).json({
      message: "Login successful",
      user: data.user,
      session: data.session
    });
  } catch (err) {
    console.error("🔥 Internal login error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Forgot / Reset Password Routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// ✅ Token Verification Route (Protected)
router.get("/verify-token", verifyToken, (req, res) => {
  return res.status(200).json({
    valid: true,
    user: req.user,
    message: "Token is valid ✅"
  });
});

module.exports = router;
