// ✅ Dependencies
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// 🔐 Supabase JWKS endpoint
const client = jwksClient({
  jwksUri: 'https://keuzissxunxbdqcordzf.supabase.co/auth/v1/keys',
});

// 🔑 Key retrieval from JWKS
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("🔐 Key retrieval error:", err.message);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// 🛡️ Middleware: Token verifier
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 1️⃣ Token check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // 2️⃣ Verify JWT with RS256 using Supabase JWKS
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"],
      audience: "authenticated",
      issuer: "https://keuzissxunxbdqcordzf.supabase.co/auth/v1",
    },
    (err, decoded) => {
      if (err) {
        console.error("❌ JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid or expired token", error: err.message });
      }

      req.user = decoded; // 🧠 Attach user
      next(); // ✅ Continue
    }
  );
};

module.exports = verifyToken;
