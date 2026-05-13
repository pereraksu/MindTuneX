const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
  type: String,
  required: [true, "Password is required"],
  minlength: 8,
  select: true,

  validate: {
    validator: function (value) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
    },

    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
  },
},

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      lowercase: true,
    },

    university: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;