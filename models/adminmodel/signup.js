const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// Define schema
const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    otp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null },
      otpCreatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", AdminSchema);
