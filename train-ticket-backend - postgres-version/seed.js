const db = require("./models");
const stationsData = require("./data/stations.json");

async function seedDatabase() {
  try {
    await db.sequelize.sync({ force: true }); // Drops & recreates tables
    console.log("📦 Database synced!");

    // ✅ Seed Stations
    await db.stations.bulkCreate(stationsData.stations);
    console.log(`✅ Seeded ${stationsData.stations.length} stations`);

    // ✅ Seed Trains
    await db.trains.bulkCreate(stationsData.trains);
    console.log(`✅ Seeded ${stationsData.trains.length} trains`);

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
