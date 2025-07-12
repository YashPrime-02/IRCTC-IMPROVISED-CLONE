const supabase = require("../utils/supabaseClient");
const logger = require("../utils/logger");

// 🚉 GET all stations from Supabase table
exports.getAllStations = async (req, res) => {
  try {
    logger.info("📍 Fetching all stations");

    const { data: stations, error } = await supabase
      .from("stations")
      .select("*")
      .order("stationname", { ascending: true }); // ✅ Ensure lowercase column name

    if (error) {
      logger.error(`❌ Supabase error (stations): ${error.message}`, error.details);
      return res.status(500).json({
        message: "Supabase error fetching stations",
        error: error.message,
        details: error.details || null,
      });
    }

    logger.info(`✅ ${stations.length} stations fetched successfully`);
    res.status(200).json(stations);
  } catch (err) {
    logger.error(`❌ Failed to fetch stations: ${err.message}`);
    res.status(500).json({
      message: "Failed to fetch stations",
      error: err.message,
    });
  }
};

// 📦 BULK INSERT station data with transform + UPSERT
exports.bulkInsertStations = async (req, res) => {
  let stations = req.body;

  if (!Array.isArray(stations) || stations.length === 0) {
    return res.status(400).json({ message: "Station list is required." });
  }

  // ✅ Convert PascalCase to snake_case for Supabase
  stations = stations.map((station) => ({
    stationid: station.stationID, // Rename to match Supabase schema
    stationname: station.stationName,
    stationcode: station.stationCode,
  }));

  try {
    logger.info(`📦 Attempting bulk upsert of ${stations.length} stations`);

    const { data, error } = await supabase
      .from("stations")
      .insert(stations, { upsert: true }); // ✅ Avoid duplicates

    if (error) {
      logger.error(`❌ Supabase insert error: ${error.message}`, error.details);
      return res.status(500).json({
        message: "Failed to insert stations",
        error: error.message,
        details: error.details || null,
      });
    }

    logger.info(`✅ ${data?.length || stations.length} stations inserted/upserted`);
    res.status(201).json({ message: "Stations inserted/upserted successfully", inserted: data });
  } catch (err) {
    logger.error(`❌ Failed to insert stations: ${err.message}`);
    res.status(500).json({
      message: "Failed to insert stations",
      error: err.message,
    });
  }
};
