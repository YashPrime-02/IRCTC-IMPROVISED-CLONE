const supabase = require("../utils/supabaseClient");
const logger = require("../utils/logger");

// 🚉 GET all stations from Supabase table
exports.getAllStations = async (req, res) => {
  try {
    logger.info("📍 Fetching all stations");

    const { data: stations, error } = await supabase
      .from("stations")
      .select("*");

    if (error) throw error;

    res.status(200).json(stations);
  } catch (err) {
    logger.error(`❌ Failed to fetch stations: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch stations", error: err.message });
  }
};

// 📦 Bulk insert station data
exports.bulkInsertStations = async (req, res) => {
  try {
    logger.info("📦 Bulk insert for stations triggered");

    // 🔁 Supabase has no ignoreDuplicates option, so we check manually or allow duplicates for now
    const { error } = await supabase
      .from("stations")
      .insert(req.body);

    if (error) throw error;

    logger.info("✅ Stations inserted successfully");
    res.status(201).json({ message: "Stations inserted successfully" });
  } catch (err) {
    logger.error(`❌ Failed to insert stations: ${err.message}`);
    res.status(500).json({ message: "Failed to insert stations", error: err.message });
  }
};
