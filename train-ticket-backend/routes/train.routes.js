module.exports = (app) => {
  const db = require("../models");
  const router = require("express").Router();

  /**
   * @route   GET /api/trains?source=CODE&destination=CODE
   * @desc    Fetch trains between two stations
   * @access  Public
   */
  router.get("/", async (req, res) => {
    const { source, destination } = req.query;

    // Validate input
    if (!source || !destination) {
      return res.status(400).json({ message: "Source and destination are required" });
    }

    try {
      const trains = await db.trains.findAll({
        where: {
          sourceCode: source,
          destinationCode: destination
        }
      });

      if (trains.length === 0) {
        return res.status(404).json({ message: "No trains found for the given route" });
      }

      res.status(200).json(trains);
    } catch (err) {
      console.error("❌ Error fetching trains:", err);
      res.status(500).json({ message: "Failed to fetch trains", error: err.message });
    }
  });

  // Register the train routes under /api/trains
  app.use("/api/trains", router);
};
