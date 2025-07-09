const supabase = require("../utils/supabaseClient");
const logger = require("../utils/logger");

// 🚉 GET all stations from Supabase table
exports.getAllStations = async (req, res) => {
  try {
    logger.info("📍 Fetching all stations");

    const { data: stations, error } = await supabase
      .from("stations")
      .select("*")
      .order("stationName", { ascending: true }); // Optional: Alphabetical order

    if (error) {
      logger.error(`❌ Supabase error (stations): ${error.message}`);
      throw error;
    }

    res.status(200).json(stations);
  } catch (err) {
    logger.error(`❌ Failed to fetch stations: ${err.message}`);
    res.status(500).json({
      message: "Failed to fetch stations",
      error: err.message,
    });
  }
};

// 📦 BULK INSERT station data (Admin only or initial load)
exports.bulkInsertStations = async (req, res) => {
  const stations = req.body;

  if (!Array.isArray(stations) || stations.length === 0) {
    return res.status(400).json({ message: "Station list is required." });
  }

  try {
    logger.info("📦 Bulk insert for stations triggered");

    const { error } = await supabase.from("stations").insert(stations);

    if (error) {
      logger.error(`❌ Supabase insert error: ${error.message}`);
      throw error;
    }

    logger.info("✅ Stations inserted successfully");
    res.status(201).json({ message: "Stations inserted successfully" });
  } catch (err) {
    logger.error(`❌ Failed to insert stations: ${err.message}`);
    res.status(500).json({
      message: "Failed to insert stations",
      error: err.message,
    });
  }
};
