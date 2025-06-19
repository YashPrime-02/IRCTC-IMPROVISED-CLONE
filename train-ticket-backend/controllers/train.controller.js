const db = require("../models");
const Station = db.stations;
const Train = db.trains;

// GET: All Stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.status(200).json(stations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stations" });
  }
};

// GET: Search Trains
exports.searchTrains = async (req, res) => {
  const { sourceCode, destinationCode } = req.query;

  if (!sourceCode || !destinationCode) {
    return res.status(400).json({ message: "Source and destination required" });
  }

  try {
    const trains = await Train.findAll({
      where: {
        sourceCode,
        destinationCode,
      },
    });

    if (trains.length === 0) {
      return res.status(404).json({ message: "No trains found" });
    }

    res.status(200).json(trains);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};
