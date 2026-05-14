const jwt = require("jsonwebtoken");

// Environment Validation
if (!process.env.JWT_SECRET) {
  throw new Error(
    "❌ JWT_SECRET is missing from environment variables"
  );
}

// Generate JWT Token
const generateToken = (id, role = "user") => {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    const payload = {
      id,
      role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "7d",
        issuer: "MindTuneX",
      }
    );

    return token;
  } catch (error) {
    console.error(
      "Token generation error:",
      error.message
    );

    throw new Error(
      "Failed to generate authentication token"
    );
  }
};

// Optional Token Verifier Utility
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET
    );
  } catch (error) {
    console.error(
      "Token verification error:",
      error.message
    );

    return null;
  }
};

module.exports = generateToken;

// Optional export
module.exports.verifyToken = verifyToken;