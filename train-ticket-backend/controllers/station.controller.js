const db = require("../models");
const Station = db.stations;

// GET all stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.status(200).json(stations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stations", error: err.message });
  }
};

// Bulk insert (optional — for static station upload)
exports.bulkInsertStations = async (req, res) => {
  try {
    await Station.bulkCreate(req.body, {
      ignoreDuplicates: true
    });
    res.status(201).json({ message: "Stations inserted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to insert stations", error: err.message });
  }
};
