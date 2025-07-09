const supabase = require("../utils/supabaseClient");
const logger = require("../utils/logger");

// 🚉 GET all stations (for dropdowns etc.)
exports.getAllStations = async (req, res) => {
  try {
    logger.info("📍 Fetching all stations");

    const { data: stations, error } = await supabase
      .from("stations")
      .select("*")
      .order("stationName", { ascending: true });

    if (error) {
      logger.error(`❌ Supabase error (stations): ${error.message}`);
      throw error;
    }

    res.status(200).json(stations);
  } catch (err) {
    logger.error(`❌ Error fetching stations: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch stations", error: err.message });
  }
};

// 🚄 SEARCH trains based on source & destination
exports.searchTrains = async (req, res) => {
  const { sourceCode, destinationCode } = req.query;

  if (!sourceCode || !destinationCode) {
    logger.warn("⚠️ Train search failed: Missing source or destination");
    return res.status(400).json({ message: "Source and destination codes are required." });
  }

  try {
    logger.info(`🔍 Searching trains: ${sourceCode} → ${destinationCode}`);

    const { data: trains, error } = await supabase
      .from("trains")
      .select("*")
      .eq("sourceCode", sourceCode)
      .eq("destinationCode", destinationCode);

    if (error) {
      logger.error(`❌ Supabase error (trains): ${error.message}`);
      throw error;
    }

    if (!trains || trains.length === 0) {
      logger.warn(`🚫 No trains found for: ${sourceCode} → ${destinationCode}`);
      return res.status(404).json({ message: "No trains found for the given route." });
    }

    logger.info(`✅ Found ${trains.length} train(s)`);
    res.status(200).json(trains);
  } catch (err) {
    logger.error(`❌ Train search failed: ${err.message}`);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
