// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import your User model

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized - No token provided");
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from token payload
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized - User not found");
    }

    // 4. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      error: "Not authorized - Invalid token",
    });
  }
};

module.exports = { protect };
