const supabase = require("../utils/supabaseClient");
const logger = require('../utils/logger');

// 📥 GET bookings by email (sorted by latest)
exports.getBookingsByEmail = async (req, res) => {
  const email = req.query.email;

  try {
    logger.info(`📩 Fetching bookings for email: ${email}`);

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", email)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    res.status(200).json(bookings);
  } catch (error) {
    logger.error(`❌ Error fetching bookings for ${email}: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ❌ DELETE booking by ID
exports.deleteBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    logger.info(`🗑️ Delete request for booking ID: ${bookingId}`);

    const { data, error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) throw error;

    if (data?.length > 0) {
      logger.info(`✅ Booking ID ${bookingId} deleted`);
      return res.status(200).json({ message: "Booking deleted successfully" });
    } else {
      logger.warn(`⚠️ Booking ID ${bookingId} not found`);
      return res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    logger.error(`❌ Error deleting booking ID ${bookingId}: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
