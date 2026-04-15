const adminOnly = (req, res, next) => {
  try {
    // 1. User check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // 2. Role check (case-insensitive 🔥)
    const role = req.user.role?.toLowerCase();

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    // 3. Allow access
    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error in admin middleware",
    });
  }
};

module.exports = { adminOnly };