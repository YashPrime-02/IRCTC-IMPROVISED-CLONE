module.exports = (app) => {
  const db = require("../models");
  const router = require("express").Router();

  // GET trains between source and destination
  router.get("/", async (req, res) => {
    const { source, destination } = req.query;

    try {
      const trains = await db.trains.findAll({
        where: {
          sourceCode: source,
          destinationCode: destination
        }
      });

      res.json(trains);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch trains", error: err });
    }
  });

  app.use("/api/trains", router);
};
