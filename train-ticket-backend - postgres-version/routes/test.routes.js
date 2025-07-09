const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// ✅ Unprotected route (basic check)
router.get("/", (req, res) => {
  res.json({ message: "✅ /api/test route is working!" });
});

// ✅ Protected route (requires valid token)
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "✅ Protected route accessed!",
    user: req.user, // decoded from token
  });
});

module.exports = router;
