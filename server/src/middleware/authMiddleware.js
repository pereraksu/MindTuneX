const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // --------------------------------------------------
    // 1. Extract Token from Authorization Header
    // --------------------------------------------------
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // --------------------------------------------------
    // 2. Token Validation
    // --------------------------------------------------
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    // --------------------------------------------------
    // 3. Verify JWT
    // --------------------------------------------------
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // --------------------------------------------------
    // 4. Find User
    // --------------------------------------------------
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    // --------------------------------------------------
    // 5. Check Account Status
    // --------------------------------------------------
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated.",
      });
    }

    // --------------------------------------------------
    // 6. Attach User to Request
    // --------------------------------------------------
    req.user = user;

    next();
  } catch (error) {
    console.error("protect middleware error:", error.message);

    // --------------------------------------------------
    // JWT Specific Errors
    // --------------------------------------------------
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // --------------------------------------------------
    // Generic Error
    // --------------------------------------------------
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  protect,
};