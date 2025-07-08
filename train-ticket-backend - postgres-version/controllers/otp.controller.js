const supabase = require("../utils/supabaseClient");  // ✅ Supabase instance
const transporter = require("../config/node.mailer"); // ✅ Nodemailer config
const crypto = require("crypto");                     // ✅ For generating reset token
const logger = require("../utils/logger");            // ✅ Winston logger

// 📤 SEND OTP to user email
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required." });

  try {
    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 mins

    // 🔍 Get user name if exists
    const { data: userData } = await supabase
      .from("users")
      .select("name")
      .eq("email", email)
      .single();

    const userName = userData?.name || "User";

    // 💾 Upsert OTP into `otps` table
    const { error: otpError } = await supabase
      .from("otps")
      .upsert([{ email, otp, expiresAt }]);

    if (otpError) throw otpError;

    // 📧 Send email using Nodemailer
    await transporter.sendMail({
      from: `"IRCTC Clone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP for IRCTC Password Reset",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your IRCTC Clone password.</p>
          <p>Please use the OTP below to proceed:</p>
          <h2 style="text-align:center; color:#1f75fe">${otp}</h2>
          <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    logger.error(`❌ Send OTP Error: ${error.message}`);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ✅ VERIFY OTP and issue reset token
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required." });

  try {
    // 🔍 Validate OTP (not expired)
    const { data: otpRecord } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .gt("expiresAt", new Date().toISOString())
      .single();

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // 🧹 Delete OTP after successful verification
    await supabase.from("otps").delete().eq("email", email);

    // 🔐 Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 💾 Save token in users table
    const { error: updateError } = await supabase
      .from("users")
      .update({ resetToken, resetTokenExpiry })
      .eq("email", email);

    if (updateError) throw updateError;

    res.status(200).json({
      message: "OTP verified successfully.",
      token: resetToken,
    });
  } catch (error) {
    logger.error(`❌ Verify OTP Error: ${error.message}`);
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};
