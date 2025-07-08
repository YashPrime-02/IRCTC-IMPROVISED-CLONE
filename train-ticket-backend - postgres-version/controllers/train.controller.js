const supabase = require("../utils/supabaseClient");
const logger = require("../utils/logger");

// 🚉 GET all stations (for dropdowns etc.)
exports.getAllStations = async (req, res) => {
  try {
    logger.info("📍 Fetching station list (Train Controller)");

    const { data: stations, error } = await supabase
      .from("stations")
      .select("*");

    if (error) throw error;

    res.status(200).json(stations);
  } catch (err) {
    logger.error(`❌ Error fetching stations: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch stations" });
  }
};

// 🚄 SEARCH trains based on source & destination
exports.searchTrains = async (req, res) => {
  const { sourceCode, destinationCode } = req.query;

  if (!sourceCode || !destinationCode) {
    logger.warn("⚠️ Train search failed: Missing source or destination");
    return res.status(400).json({ message: "Source and destination required" });
  }

  try {
    logger.info(`🔍 Train search: ${sourceCode} → ${destinationCode}`);

    const { data: trains, error } = await supabase
      .from("trains")
      .select("*")
      .eq("sourceCode", sourceCode)
      .eq("destinationCode", destinationCode);

    if (error) throw error;

    if (trains.length === 0) {
      logger.warn(`🚫 No trains found: ${sourceCode} → ${destinationCode}`);
      return res.status(404).json({ message: "No trains found" });
    }

    logger.info(`✅ ${trains.length} train(s) found`);
    res.status(200).json(trains);
  } catch (err) {
    logger.error(`❌ Train search failed: ${err.message}`);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
