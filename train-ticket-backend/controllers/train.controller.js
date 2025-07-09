// const db = require("../models");
// const Station = db.stations;
// const Train = db.trains;
// const logger = require("../utils/logger");

// exports.getAllStations = async (req, res) => {
//   try {
//     logger.info("📍 Fetching station list (Train Controller)");

//     const stations = await Station.findAll();
//     res.status(200).json(stations);
//   } catch (err) {
//     logger.error(`❌ Error fetching stations: ${err.message}`);
//     res.status(500).json({ message: "Failed to fetch stations" });
//   }
// };

// exports.searchTrains = async (req, res) => {
//   const { sourceCode, destinationCode } = req.query;

//   if (!sourceCode || !destinationCode) {
//     logger.warn("⚠️ Train search failed: Missing source or destination");
//     return res.status(400).json({ message: "Source and destination required" });
//   }

//   try {
//     logger.info(`🔍 Train search: ${sourceCode} → ${destinationCode}`);

//     const trains = await Train.findAll({
//       where: {
//         sourceCode,
//         destinationCode,
//       },
//     });

//     if (trains.length === 0) {
//       logger.warn(`🚫 No trains found: ${sourceCode} → ${destinationCode}`);
//       return res.status(404).json({ message: "No trains found" });
//     }

//     logger.info(`✅ ${trains.length} train(s) found`);
//     res.status(200).json(trains);
//   } catch (err) {
//     logger.error(`❌ Train search failed: ${err.message}`);
//     res.status(500).json({ message: "Search failed" });
//   }
// };
