const Admin = require("../models/adminmodel/signup");
const bcrypt = require("bcryptjs");
const sendOtpResetEmail = require("../config/passwordresetmail");
const session = require("express-session");
const User = require("../models/usermodel/signup");
// const Deposit = require("../models/usermodel/deposit");
// const Wallet = require("../models/usermodel/userwallets");
const AdminWallet = require("../models/adminmodel/wallet");
// const Withdraw = require("../models/usermodel/withdraw");
const Trade = require("../models/usermodel/trade");
const Kyc = require("../models/usermodel/kyc");
const { generateUploadURL } = require('../middlewares/cloudinary')


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

    req.session.admin = {
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
}


const uploadWallets = async (req, res) => {
  try {
    let data = await generateUploadURL(req.file)
    let info = {
      walletName: req.body.walletName ?? "",
      network: req.body.network ?? "",
      walletAddress: req.body.walletAddress ?? "",
      walletQRCode: data.uploadUrl
    };

    const adminWallet = await new AdminWallet(info).save();
    if (adminWallet !== null) {
      req.session.message = "wallet created";
      res.redirect("/admin/");
    } else {
      req.session.message = "error uploading wallet";
      res.redirect("/admin/");
    }
  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/admin/");
  }
}

// edit user balance
const editBal = async (req, res) => {
  try {
    let { amount, balance, email, type } = req.body

    balance = Number(balance)
    amount = Number(amount)

    if(type == 'increase'){
      balance += amount
    }else{
      balance -= amount
    }

    await User.updateOne({ email }, 
        {
            $set:{
                balance: balance
            }
        }
    )

    res.redirect(`/admin/usersingle/${email}`);

  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/admin/");
  }
}


// edit user balance
const manipulateTrade = async (req, res) => {
  let { email, id, status, amount, pnl } = req.body

  try {
    let info = {
      marketSelect: req.body.marketSelect ?? "",
      tradeTime: req.body.tradeTime ?? "",
      leverage: req.body.leverage ?? "",
      amount: req.body.amount ?? "",
      tradeType: req.body.tradeType ?? "",
      createddate: req.body.createddate ?? "",
      pnl: req.body.pnl ?? "",
      status: req.body.status ?? "",
      outcome: req.body.outcome ?? "",
      commission: req.body.commission ?? "",
      limitOrder: req.body.limitOrder ?? "",
    }

    await Trade.updateOne({ _id: id, email }, { $set: info });

    if(status == 'Closed' && pnl == 'Profit'){
      const user = await User.findOne({ email });
      user.profit += Number(amount)
      await user.save()
    }

    req.session.message = 'trade manipulated'
    res.redirect(`/admin/updatetrade/${email}/${id}`);

  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/admin/");
  }
}

module.exports = {
  Signup,
  Login,
  sendOtp,
  resetPassword,
  uploadWallets,
  editBal,
  manipulateTrade
}
