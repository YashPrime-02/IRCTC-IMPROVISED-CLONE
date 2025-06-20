const db = require('../middleware/models');
const transporter = require('../config/node.mailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

const Otp = db.otps;
const User = db.users;

// ✅ SEND OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

    // ✅ Store or update OTP
    await Otp.upsert({ email, otp, expiresAt });

    // ✅ Send email
    await transporter.sendMail({
      from: `"IRCTC Clone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP for Password Reset",
      html: `
        <p>Hello,</p>
        <p>Your OTP to reset your IRCTC password is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ✅ VERIFY OTP + GENERATE RESET TOKEN
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required." });

  try {
    const record = await Otp.findOne({
      where: {
        email,
        otp,
        expiresAt: { [Op.gt]: new Date() } // not expired
      }
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // ✅ Delete OTP once validated
    await Otp.destroy({ where: { email } });

    // ✅ Generate reset token and save to user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // ✅ Send token back to frontend (to use in reset-password route)
    return res.status(200).json({
      message: "OTP verified successfully.",
      token: resetToken
    });

  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};
