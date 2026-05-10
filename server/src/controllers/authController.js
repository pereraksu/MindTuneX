const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  university: user.university || "",
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

const registerUser = async (req, res) => {
  try {
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    const university = req.body.university?.trim() || "";

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const userExists = await User.findOne({ email }).lean();

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      university,
      lastLogin: new Date(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("registerUser error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Register failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("loginUser error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};