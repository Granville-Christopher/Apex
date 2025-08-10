const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generateUserId = require("../../config/idgenerator");

// Define schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
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
    id: {
      type: String,
      index: true,
      unique: true,
      default: generateUserId,
    },
    otp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null },
      otpCreatedAt: { type: Date, default: Date.now },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
      required: false,
    },
    profit: {
      type: Number,
      default: 0,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    accountType: {
      type: String,
      required: false,
      default: "Live Account",
    },
    accountStatus: {
      type: String,
      required: false,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
