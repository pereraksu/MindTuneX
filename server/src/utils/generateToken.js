const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.sign(
      { id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );
  } catch (error) {
    console.error("Token generation error:", error.message);
    throw new Error("Failed to generate token");
  }
};

module.exports = generateToken;