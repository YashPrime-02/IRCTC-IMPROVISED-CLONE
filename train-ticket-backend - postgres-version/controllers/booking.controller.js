const supabase = require("../utils/supabaseClient");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

// 🔐 Utility to extract and verify Bearer token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// 📥 GET bookings by logged-in user's email
exports.getBookingsByEmail = async (req, res) => {
  const decoded = verifyToken(req);
  if (!decoded) {
    logger.warn("Unauthorized booking fetch attempt.");
    return res.status(401).json({ message: "Unauthorized or invalid token." });
  }

  try {
    logger.info(`📩 Fetching bookings for user: ${decoded.email}`);

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", decoded.email)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    res.status(200).json(bookings);
  } catch (error) {
    logger.error(`❌ Error fetching bookings: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ❌ DELETE booking by ID (only if belongs to logged-in user)
exports.deleteBookingById = async (req, res) => {
  const decoded = verifyToken(req);
  if (!decoded) {
    logger.warn("Unauthorized delete attempt.");
    return res.status(401).json({ message: "Unauthorized or invalid token." });
  }

  const bookingId = req.params.id;

  try {
    // 🔎 Verify booking ownership first
    const { data: existing, error: fetchErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchErr || !existing) {
      logger.warn(`⚠️ Booking ID ${bookingId} not found.`);
      return res.status(404).json({ message: "Booking not found." });
    }

    if (existing.email !== decoded.email) {
      logger.warn(`🔒 Access denied to delete booking ID ${bookingId}`);
      return res.status(403).json({ message: "You are not authorized to delete this booking." });
    }

    // ✅ Delete
    const { error: deleteErr } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (deleteErr) throw deleteErr;

    logger.info(`✅ Booking ID ${bookingId} deleted by ${decoded.email}`);
    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (err) {
    logger.error(`❌ Error deleting booking ID ${bookingId}: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
