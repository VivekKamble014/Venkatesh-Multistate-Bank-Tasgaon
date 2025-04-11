const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🚨 No token found in headers.");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔍 Received Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    if (!decoded.isAdmin) {
      console.log("⛔ Access Denied - Not an Admin:", decoded);
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decoded;
    console.log("✅ Admin Verified - Proceeding...");
    next();
  } catch (err) {
    console.error("🔥 JWT Error:", err);
    return res.status(400).json({ message: "Invalid token" });
  }
};

// for update profile

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
