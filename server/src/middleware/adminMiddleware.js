const adminOnly = (req, res, next) => {
  try {
    // --------------------------------------------------
    // 1. Authentication Check
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please login first.",
      });
    }

    // --------------------------------------------------
    // 2. Normalize Role
    // --------------------------------------------------
    const role = String(req.user.role || "")
      .trim()
      .toLowerCase();

    // --------------------------------------------------
    // 3. Admin Validation
    // --------------------------------------------------
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // --------------------------------------------------
    // 4. Optional Account Status Check
    // --------------------------------------------------
    if (req.user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "This admin account has been deactivated.",
      });
    }

    // --------------------------------------------------
    // 5. Continue
    // --------------------------------------------------
    next();
  } catch (error) {
    console.error("adminOnly middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error in admin authorization middleware",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  adminOnly,
};