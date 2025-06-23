const db = require("../models");
const Station = db.stations;
const logger = require('../utils/logger');

// GET all stations
exports.getAllStations = async (req, res) => {
  try {
    logger.info("📍 Fetching all stations");

    const stations = await Station.findAll();
    res.status(200).json(stations);
  } catch (err) {
    logger.error(`❌ Failed to fetch stations: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch stations", error: err.message });
  }
};

// Bulk insert (optional — for static station upload)
exports.bulkInsertStations = async (req, res) => {
  try {
    logger.info("📦 Bulk insert for stations triggered");

    await Station.bulkCreate(req.body, {
      ignoreDuplicates: true
    });

    logger.info("✅ Stations inserted successfully");
    res.status(201).json({ message: "Stations inserted successfully" });
  } catch (err) {
    logger.error(`❌ Failed to insert stations: ${err.message}`);
    res.status(500).json({ message: "Failed to insert stations", error: err.message });
  }
};
