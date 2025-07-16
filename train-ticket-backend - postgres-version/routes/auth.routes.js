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
  console.log("📥 Signup request received:", { email, name });

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing name, email, or password" });
  }

  try {
    // ✅ Step 1: Supabase Auth signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      console.error("❌ Supabase signup error:", error.message);

      if (
        error.message.toLowerCase().includes("user already registered") ||
        error.message.toLowerCase().includes("user already exists")
      ) {
        return res.status(409).json({ error: "User already exists. Please log in or reset your password." });
      }

      if (error.message.toLowerCase().includes("password")) {
        return res.status(400).json({ error: "Password does not meet security requirements." });
      }

      return res.status(400).json({ error: error.message });
    }

    const user = data?.user;
    if (!user || !user.id) {
      return res.status(400).json({ error: "Signup failed. No user ID returned." });
    }

    console.log("✅ Supabase user created:", user.id);

    // ✅ Step 2: Check if user already exists in DB
    const { data: existingUser, error: findErr } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existingUser) {
      console.warn("⚠️ User already exists in users table, skipping insert.");
    } else {
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            name,
            email,
            password // ⚠️ Plain text (not recommended for production)
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error("❌ Error saving user to DB:", dbError.details || dbError.message);
        return res.status(400).json({ error: "Database error saving new user" });
      }
    }

    console.log("✅ User saved to DB:", email);
    return res.status(201).json({
      message: "Signup successful! Please verify your email.",
      user
    });
  } catch (err) {
    console.error("🔥 Internal server error:", err.message);
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
