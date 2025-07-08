const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// ✅ Example route to test JWT-based auth protection
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "✅ Protected route accessed!",
    user: req.user, // decoded from token
  });
});

module.exports = router;
