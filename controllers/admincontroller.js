const Admin = require("../models/adminmodel/signup");
const bcrypt = require("bcryptjs");
const sendOtpEmail = require("../config/passwordresetmail");
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
        email: admin.email
    }

    return res.status(200).json({success: "login successful"})
  } catch (error) {
    return res.status(500).json({error: "internal server error"})
  }
};

module.exports = {
  Signup,
  Login,
};
