const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1️⃣ Check if Authorization header is missing or malformed
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "irctc_secret_key");
    
    // 3️⃣ Attach decoded user info to the request
    req.user = decoded;

    // 4️⃣ Continue to the next middleware/route
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = verifyToken;
