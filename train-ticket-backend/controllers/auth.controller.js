const db = require("../middleware/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/node.mailer");
const crypto = require("crypto");
const { Op } = require("sequelize");
const logger = require('../utils/logger');

const User = db.users;

// ✅ SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      logger.warn("Signup failed: Missing fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn(`Signup failed: User already exists (${email})`);
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    logger.info(`✅ New user registered: ${email}`);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    logger.error(`❌ Signup Error: ${error.message}`);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      logger.warn("Login failed: Email or password missing");
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
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
      "irctc_secret_key",
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

// ✅ FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Forgot password failed: User not found (${email})`);
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

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

// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      logger.warn("Reset password failed: Invalid/expired token");
      return res.status(400).json({ message: "Token is invalid or expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    logger.info(`🔒 Password updated successfully for ${user.email}`);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    logger.error(`❌ Reset Password Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ VERIFY TOKEN (Optional: Move to verifyToken.js if needed)
exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.warn("Token verification failed: No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "irctc_secret_key");
    logger.info(`🔐 Token verified for user ${decoded.email}`);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    logger.warn("Token verification failed: Invalid or expired");
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
