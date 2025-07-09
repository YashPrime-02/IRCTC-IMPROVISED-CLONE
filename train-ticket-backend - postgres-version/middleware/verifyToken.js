const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// 🛡️ JWKS client setup for Supabase
const client = jwksClient({
  jwksUri: 'https://keuzissxunxbdqcordzf.supabase.co/auth/v1/keys',
});

// 🔑 Dynamic key retriever
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1️⃣ Check token presence and format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // 2️⃣ Verify using RS256 and Supabase's keys
  jwt.verify(token, getKey, {
    algorithms: ['RS256'],
    audience: 'authenticated',
    issuer: 'https://keuzissxunxbdqcordzf.supabase.co/auth/v1'
  }, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }

    // 3️⃣ Attach user info from token
    req.user = decoded;

    // 4️⃣ Continue to next middleware
    next();
  });
};

module.exports = verifyToken;
