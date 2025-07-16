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


// ✅ Signup via Supabase Auth + Save to users table
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  console.log("📥 Signup request received:", req.body);

  try {
    // Step 1: Supabase Auth signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name } // stored in user_metadata
      }
    });

    if (error) {
      console.error("❌ Supabase signup error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    const user = data?.user;
    if (!user) {
      console.error("❌ No user returned from Supabase signup");
      return res.status(400).json({ error: "Signup failed." });
    }

    // Step 2: Insert into your custom `users` table
    const { error: dbError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,        // same as Supabase Auth user id (UUID)
          name: name,
          email: email,
          password: password  // ❗optional: you can hash this later
        }
      ]);

    if (dbError) {
      console.error("❌ Error saving user to 'users' table:", dbError.message);
      return res.status(400).json({ error: "Database error saving new user" });
    }

    console.log("✅ User signed up and saved to DB:", email);
    return res.status(201).json({
      message: "Signup successful! Please verify your email.",
      user: user
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
