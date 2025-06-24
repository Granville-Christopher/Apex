const User = require("../models/usermodel/signup");
const sendOtpEmail = require("../config/mail");
const sendOtpResetEmail = require("../config/passwordresetmail");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const uploadAuth = require("../middlewares/upload");
const KycVerification = require("../models/usermodel/kyc");

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    newUser.otp = { code: otp, expiresAt: otpExpires };
    await sendOtpEmail(email, otp);

    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

const otpAuth = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otp.code) {
      return res.status(400).json({ error: "OTP not found or not requested" });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.otp = { code: null, expiresAt: null };
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Authentication Successful" });
  } catch (error) {
    console.error("Authentication failed", error);
    res.status(500).json({ error: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = {
      code: otp,
      expiresAt: otpExpires,
      otpCreatedAt: new Date(),
    };

    await sendOtpEmail(email, otp);
    await user.save();

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    res.status(200).json({ message: "Successfully verified" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const submitKyc = (req, res) => {
  uploadAuth.fields([
    { name: "cardFront", maxCount: 1 },
    { name: "cardBack", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "File upload failed" });
    }

    try {
      const userId = req.session.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized, please login" });
      }

      const { verificationType } = req.body;
      const cardFront = req.files?.cardFront?.[0]?.filename;
      const cardBack = req.files?.cardBack?.[0]?.filename;

      if (!cardFront || !cardBack) {
        return res.status(400).json({ error: "Both card images are required" });
      }

      const newKyc = new Kyc({
        userId,
        verificationType,
        cardFront,
        cardBack,
      });

      await newKyc.save();

      res.status(200).json({ message: "KYC submitted successfully" });
    } catch (error) {
      console.error("KYC error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = { code: otp, expiresAt: otpExpires };
    await sendOtpEmail(email, otp);
    await user.save();

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User with this email not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = { code: otp, expiresAt: otpExpires };
    await user.save();

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
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user || !user.otp || !user.otp.code) {
      return res.status(400).json({ error: "OTP not found or not requested" });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = { code: null, expiresAt: null };
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  Signup,
  otpAuth,
  login,
  resendOtp,
  verifyOtp,
  sendOtp,
  resetPassword,
  submitKyc,
};
