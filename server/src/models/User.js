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
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      lowercase: true,
      index: true,
    },

    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    university: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hide password in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Useful indexes
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);