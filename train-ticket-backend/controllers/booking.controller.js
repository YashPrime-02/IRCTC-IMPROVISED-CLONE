// const db = require("../middleware/models");
// const Booking = db.bookings;
// const logger = require('../utils/logger');

// exports.getBookingsByEmail = async (req, res) => {
//   const email = req.query.email;

//   try {
//     logger.info(`📩 Fetching bookings for email: ${email}`);

//     const bookings = await Booking.findAll({
//       where: { email },
//       order: [['createdAt', 'DESC']]
//     });

//     res.status(200).json(bookings);
//   } catch (error) {
//     logger.error(`❌ Error fetching bookings for ${email}: ${error.message}`);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.deleteBookingById = async (req, res) => {
//   const bookingId = req.params.id;

//   try {
//     logger.info(`🗑️ Delete request for booking ID: ${bookingId}`);

//     const deleted = await Booking.destroy({ where: { id: bookingId } });

//     if (deleted) {
//       logger.info(`✅ Booking ID ${bookingId} deleted`);
//       return res.status(200).json({ message: "Booking deleted successfully" });
//     } else {
//       logger.warn(`⚠️ Booking ID ${bookingId} not found`);
//       return res.status(404).json({ message: "Booking not found" });
//     }
//   } catch (err) {
//     logger.error(`❌ Error deleting booking ID ${bookingId}: ${err.message}`);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
