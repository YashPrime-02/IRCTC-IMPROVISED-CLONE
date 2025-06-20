const db = require("../middleware/models");
const transporter = require("../config/node.mailer");
const crypto = require("crypto");
const { Op } = require("sequelize");

const Otp = db.otps;
const User = db.users;

// ✅ SEND OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins
    // 🧠 Fetch user for name
    const user = await User.findOne({ where: { email } });
    const userName = user?.name || "User";

    // ✅ Store or update OTP
    await Otp.upsert({ email, otp, expiresAt });

    // ✅ Send email
    await transporter.sendMail({
      from: `"IRCTC Clone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP for IRCTC Password Reset",
      html: `
    <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px; line-height: 1.6; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
      <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${userName}</strong>,</p>

      <p style="font-size: 15px; margin-bottom: 10px;">
        We received a request to reset your <strong>IRCTC Clone</strong> account password.
      </p>

      <p style="font-size: 15px; margin-bottom: 10px;">Please use the following OTP to proceed:</p>

      <h2 style="font-size: 28px; color: #1f75fe; letter-spacing: 4px; text-align: center; margin: 20px 0;">${otp}</h2>

      <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
        This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
      </p>

      <p style="font-size: 14px; color: #999;">If you didn’t request this, you can safely ignore this email.</p>

      <p style="font-size: 14px; color: #999; margin-top: 30px;">Regards,<br/><strong>IRCTC Clone Support Team</strong></p>
    </div>
  `,
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
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
        expiresAt: { [Op.gt]: new Date() }, // not expired
      },
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
      token: resetToken,
    });
  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};
