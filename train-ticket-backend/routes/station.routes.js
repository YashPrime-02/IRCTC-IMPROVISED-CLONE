module.exports = (app) => {
  const db = require("../models");
  const router = require("express").Router();

  // GET all stations
  router.get("/", async (req, res) => {
    try {
      const stations = await db.stations.findAll();
      res.json(stations);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch stations", error: err });
    }
  });

  app.use("/api/stations", router);
};
