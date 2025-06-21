const Admin = require("../models/adminmodel/signup");
const bcrypt = require("bcryptjs");
const sendOtpResetEmail = require("../config/passwordresetmail");
const session = require("express-session");

const Signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(200).json({ success: "registration successful" });
  } catch (error) {
    console.error("signup error", error);
    return res
      .status(500)
      .json({ error: "internal server error, please try again later" });
  }
};

const Login = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    req.session.admi = {
      id: admin._id,
      email: admin.email,
    };

    return res.status(200).json({ success: "login successful" });
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin with this email not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    admin.otp = { code: otp, expiresAt: otpExpires };
    await admin.save();

    await sendOtpResetEmail(email, otp);

    res
      .status(200)
      .json({ message: "OTP sent to your email. only valid in 5 minutes" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ error: "Failed to send OTP." });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const admin = await Admin.findOne({ email });
    console.log("Found admin:", admin);

    if (!admin || !admin.otp || !admin.otp.code) {
      return res.status(400).json({ error: "OTP not found or not requested" });
    }

    if (admin.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (admin.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.otp = { code: null, expiresAt: null };
    await admin.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  Signup,
  Login,
  sendOtp,
  resetPassword,
};
