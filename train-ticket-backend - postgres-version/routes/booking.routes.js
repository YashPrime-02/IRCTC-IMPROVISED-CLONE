const express = require("express");
const router = express.Router();
const db = require("../middleware/models");
const Booking = db.bookings;

// ✅ POST - Save Booking
router.post("/", async (req, res) => {
  try {
    const data = await Booking.create(req.body);
    res.status(201).json({ message: "Booking saved", data });
  } catch (err) {
    console.error("❌ Booking save error:", err);
    res.status(500).json({ message: "Failed to save booking" });
  }
});

// ✅ GET - Get All Bookings by Email
router.get("/", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const bookings = await Booking.findAll({
      where: { email },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("❌ Booking fetch error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ❌ DELETE - Delete booking by ID
router.delete("/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const deleted = await Booking.destroy({ where: { id: bookingId } });

    if (deleted) {
      res.status(200).json({ message: "Booking deleted successfully" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    console.error("❌ Booking delete error:", err);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

module.exports = router;
