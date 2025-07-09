// ✅ Dependencies
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// 🔐 JWKS client setup – Supabase public JWKS endpoint
const client = jwksClient({
  jwksUri: 'https://keuzissxunxbdqcordzf.supabase.co/auth/v1/keys',
});

// 🔑 Public key retriever (for RS256 decoding)
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error("🔐 Key retrieval error:", err.message);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// 🛡️ Token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1️⃣ Token presence check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // 2️⃣ JWT verification with Supabase public keys
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
      audience: 'authenticated',
      issuer: 'https://keuzissxunxbdqcordzf.supabase.co/auth/v1'
    },
    (err, decoded) => {
      if (err) {
        console.error("❌ JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid or expired token", error: err.message });
      }

      // 3️⃣ Attach decoded user to request object
      req.user = decoded;
      next();
    }
  );
};

module.exports = verifyToken;
