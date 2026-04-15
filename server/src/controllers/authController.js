const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// --------------------------------------------------
// REGISTER
// --------------------------------------------------
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, university } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      university: university || "",
      lastLogin: new Date(),
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        university: user.university,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
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

// --------------------------------------------------
// LOGIN
// --------------------------------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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

    // ✅ IMPORTANT: update last login time
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        university: user.university,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
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

// --------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};