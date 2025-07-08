// 🔌 Import Supabase Client
const supabase = require("../utils/supabaseClient");

// 🔐 Utilities
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/node.mailer");
const crypto = require("crypto");
const logger = require('../utils/logger');

// 📩 SIGNUP controller - Registers a new user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 🚫 Check if fields are empty
    if (!name || !email || !password) {
      logger.warn("Signup failed: Missing fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    // 🔎 Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      logger.warn(`Signup failed: User already exists (${email})`);
      return res.status(400).json({ message: "User already exists!" });
    }

    // 🔐 Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Insert new user into Supabase
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }]);

    if (insertError) throw insertError;

    logger.info(`✅ New user registered: ${email}`);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    logger.error(`❌ Signup Error: ${error.message}`);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// 🔓 LOGIN controller - Authenticates a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🚫 Basic validation
    if (!email || !password) {
      logger.warn("Login failed: Email or password missing");
      return res.status(400).json({ message: "Email and password are required." });
    }

    // 🔎 Check user in Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      logger.warn(`Login failed: User not found (${email})`);
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid credentials (${email})`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🪙 Create JWT token for session
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    logger.info(`✅ Login successful: ${email}`);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`❌ Login Error: ${error.message}`);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// 📧 FORGOT PASSWORD controller - Sends reset link to email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 🔍 Check if user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      logger.warn(`Forgot password failed: User not found (${email})`);
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Create token & expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now

    // 💾 Save token in DB
    const { error: updateError } = await supabase
      .from("users")
      .update({ resetToken: token, resetTokenExpiry: expiry.toISOString() })
      .eq("email", email);

    if (updateError) throw updateError;

    // 📩 Send password reset email
    const resetLink = `http://localhost:4200/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `IRCTC Support <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset your IRCTC password",
      html: `
        <p>Hi ${user.name || "User"},</p>
        <p>You requested a password reset. Click below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    logger.info(`📩 Reset password link sent to: ${email}`);
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    logger.error(`❌ Forgot Password Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔁 RESET PASSWORD controller - Updates user's password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 🔍 Find user with matching resetToken and valid expiry
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("resetToken", token)
      .gt("resetTokenExpiry", new Date().toISOString())
      .single();

    if (!user || error) {
      logger.warn("Reset password failed: Invalid/expired token");
      return res.status(400).json({ message: "Token is invalid or expired." });
    }

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 💾 Save new password and clear token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .eq("email", user.email);

    if (updateError) throw updateError;

    logger.info(`🔒 Password updated successfully for ${user.email}`);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    logger.error(`❌ Reset Password Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🛡️ VERIFY TOKEN controller - Verifies JWT token
exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.warn("Token verification failed: No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`🔐 Token verified for user ${decoded.email}`);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    logger.warn("Token verification failed: Invalid or expired");
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
