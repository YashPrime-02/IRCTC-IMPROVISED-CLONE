const db = require("../models");
const Booking = db.bookings;

// 📥 GET bookings by email
exports.getBookingsByEmail = async (req, res) => {
  const email = req.query.email;

  try {
    const bookings = await Booking.findAll({
      where: { email },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ❌ DELETE booking by ID
exports.deleteBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const deleted = await Booking.destroy({ where: { id: bookingId } });

    if (deleted) {
      return res.status(200).json({ message: "Booking deleted successfully" });
    } else {
      return res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    console.error("Error deleting booking:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
