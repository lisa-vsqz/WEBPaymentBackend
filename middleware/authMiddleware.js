// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Inside authMiddleware.js
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("AuthMiddleware Error: Missing or invalid token.");
    return res
      .status(401)
      .json({ message: "No token provided or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("AuthMiddleware Error: Invalid or expired token.");
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
