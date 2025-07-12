const supabase = require("../utils/supabaseClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/node.mailer");
const crypto = require("crypto");
const logger = require('../utils/logger');

// 📩 SIGNUP controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      logger.warn("Signup failed: Missing fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      logger.warn(`Signup failed: User already exists (${email})`);
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

// 🔓 LOGIN controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      logger.warn("Login failed: Email or password missing");
      return res.status(400).json({ message: "Email and password are required." });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      logger.warn(`Login failed: User not found (${email})`);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid credentials (${email})`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    logger.info(`✅ Login successful: ${email}`);
    res.status(200).json({
      token: `Bearer ${token}`,
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

// 📧 FORGOT PASSWORD controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("email, name")
      .eq("email", email)
      .single();

    if (error || !user) {
      logger.warn(`Forgot password failed: User not found (${email})`);
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const { error: updateError } = await supabase
      .from("users")
      .update({
        resetToken: token,
        resetTokenExpiry: expiry.toISOString(),
      })
      .eq("email", email);

    if (updateError) throw updateError;

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `IRCTC Support <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset your IRCTC password",
      html: `
        <p>Hi ${user.name || "User"},</p>
        <p>You requested a password reset. Click the link below:</p>
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


// 🔁 RESET PASSWORD controller
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // ✅ Input validation to prevent undefined in bcrypt
  if (!token || typeof newPassword !== "string" || newPassword.trim() === "") {
    return res.status(400).json({ message: "Token and valid new password are required." });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("resetToken", token)
      .filter("resetTokenExpiry", "gt", new Date().toISOString())
      .single();

    if (!user || error) {
      logger.warn("Reset password failed: Invalid/expired token");
      return res.status(400).json({ message: "Token is invalid or expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .eq("email", user.email);

    if (updateError) throw updateError;

    logger.info(`🔒 Password updated for ${user.email}`);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    logger.error(`❌ Reset Password Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 🛡️ VERIFY JWT TOKEN controller
exports.verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Token verification failed: Missing or invalid format");
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`🔐 Token verified for user ${decoded.email}`);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    logger.warn("Token verification failed: Invalid or expired");
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
