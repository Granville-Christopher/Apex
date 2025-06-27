const User = require("../models/usermodel/signup");
const sendOtpEmail = require("../config/mail");
const sendOtpResetEmail = require("../config/passwordresetmail");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const Deposit = require("../models/usermodel/deposit");
const Wallet = require("../models/usermodel/userwallets");
const Withdraw = require("../models/usermodel/withdraw");
const Trade = require("../models/usermodel/trade");
const Kyc = require("../models/usermodel/kyc");
const { uploadsTwo } = require("../middlewares/uploads");
const { generateUploadURL } = require('../middlewares/cloudinary')

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

    await newUser.save();
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

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

// submit kyc by user
const submitKyc = (req, res) => {
  uploadsTwo.fields([
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
      const cardFrontFile = req.files?.cardFront?.[0];
      const cardBackFile = req.files?.cardBack?.[0];

      if (!cardFrontFile || !cardBackFile) {
        return res.status(400).json({ error: "Both card images are required" });
      }

      // Upload both files to Cloudinary
      const [frontUpload, backUpload] = await generateUploadURLs([cardFrontFile, cardBackFile]);

      // Save to database
      const newKyc = new Kyc({
        userId,
        verificationType,
        cardFront: frontUpload.uploadUrl,
        cardBack: backUpload.uploadUrl,
      });

      await newKyc.save();

      res.status(200).json({
        message:
          "KYC submitted successfully! Your details are under review, we'll get back to you within 24 hours with a response.",
      });
    } catch (error) {
      console.error("KYC error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
}


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

    if (user.block === true) {
      return res.status(403).json({
        error:
          "Account Blocked.",
      });
    }
    
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const kycRecord = await Kyc.findOne({ userId: user._id });

    if (!kycRecord) {
      return res.status(403).json({
        error:
          "Please verify your KYC to proceed. Redirecting to verification page...",
        redirect: "/kycverification",
        delay: 5000,
      });
    }

    if (kycRecord.status === "pending") {
      return res.status(403).json({
        error:
          "Your KYC has not been approved. Please contact support if not approved after 24 hours.",
      });
    }

    if (kycRecord.status === "rejected") {
      return res.status(403).json({
        error:
          "Your KYC verification was rejected. Please verify again. Redirecting...",
        redirect: "/kycverification",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = {
      code: otp,
      expiresAt: otpExpires,
      otpCreatedAt: new Date(),
    };

    try {
      await sendOtpEmail(email, otp);
    } catch (mailError) {
      console.error("Email error:", mailError);
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    await user.save();

    res.status(200).json({ message: "Login successful, OTP sent" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const tradeSub = async (req, res) => {
  const { marketSelect1, tradeTime1, leverage1, cdate, tType, amount1, email, balance } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let info = {
      email: email,
      marketSelect: marketSelect1,
      tradeTime: tradeTime1,
      leverage: leverage1,
      amount: amount1,
      createddate: cdate,
      tradeType: tType
    };

    await new Trade(info).save();

    await User.updateOne({ email: email }, 
        {
            $set:{
                balance: balance
            }
        }
    )

    res.status(200).json({ message: "Trade Started" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

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

// deposit sub
const depositSub = async (req, res) => {
  try {
    let data = await generateUploadURL(req.file)
    let info = {
      email: req.body.email ?? "",
      amount: Number(req.body.amount) ?? "",
      network: req.body.network ?? "",
      waddress: req.body.waddress ?? "",
      subData: data.uploadUrl,
      createddate: new Date().toISOString().slice(0, 10)
    };

    const deposit = await new Deposit(info).save();
    if (deposit !== null) {
      req.session.message = "deposit request successful";
      res.redirect("/deposit");
    } else {
      req.session.message = "error making deposit";
      res.redirect("/deposit");
    }
  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/deposit");
  }
};

// deposit sub
const withdrawalSub = async (req, res) => {
  try {
    const { waddress, amount, email } = req.body;

    if (!waddress || waddress.trim() === "") {
      req.session.message = "no address entered";
      res.redirect("/withdrawals");
    }

    const user = await User.findOne({ email });

    if (!user) {
      req.session.message = "invalid account";
      res.redirect("/withdrawals");
    }

    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      req.session.message = "Invalid withdrawal amount.";
      res.redirect("/withdrawals");
    }

    if (user.balance < withdrawalAmount) {
      req.session.message = "Insufficient balance";
      res.redirect("/withdrawals");
    }

    const withdrawal = new Withdraw({
      email,
      amount: withdrawalAmount,
      waddress,
      createddate: new Date().toISOString().slice(0, 10)
    });

    await withdrawal.save();

    user.balance -= withdrawalAmount;
    await user.save();

    req.session.message = "withdrawal request successful";
    res.redirect("/withdrawals");
  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/withdrawals");
  }
};

// wallet sub
const walletSub = async (req, res) => {
  try {
    let info = {
      email: req.body.email ?? "",
      walletname: req.body.walletname ?? "",
      network: req.body.network ?? "",
      waddress: req.body.waddress ?? "",
    };

    const wallet = await new Wallet(info).save();
    if (wallet !== null) {
      req.session.message = "wallet uploaded successful";
      res.redirect("/wallets");
    } else {
      req.session.message = "error uploading wallet";
      res.redirect("/wallets");
    }
  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/wallets");
  }
};

// delete wallet
const deleteWalletSub = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      res.redirect("/");
    }

    await Wallet.deleteOne({ _id: id });

    res.redirect("/wallets");
  } catch (error) {
    console.log(error);
    res.redirect("/wallets");
  }
};

// delete transaction
const deleteTransactionSub = async (req, res) => {
  try {
    let id = req.params.id;
    let type = req.query.type;

    if (!id) {
      res.redirect("/");
    }

    if(type == 'Deposit'){
      await Deposit.deleteOne({ _id: id });
    }else{
      await Withdraw.deleteOne({ _id: id });
    }

    res.redirect("/transactions");
  } catch (error) {
    console.log(error);
    res.redirect("/transactions");
  }
};

// update account
const settingsSub = async (req, res) => {
    try{
        const user = await User.updateOne({ email: req.body.email }, 
            {
                $set:{
                    name: req.body.name,
                    phone: req.body.phone,
                    country: req.body.country,
                }
            }
        )
        
        if(user !== null){
            req.session.message = "account updated";
            res.redirect("/settings");
        }else{
          req.session.message = "error updating account";
          res.redirect("/settings")
        }


    }catch (error) {
      console.log(error)
      req.session.message = "error completing request";
      res.redirect("/settings");
    }
}

// update password
const changePassSub = async (req, res) => {
    try{
        const { email, password, conpass } = req.body;
        
        if (password !== conpass) {
          req.session.message = "password mismatch";
          res.redirect("/settings");
        }

        const user = await User.findOne({ email });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        req.session.message = "password changed...";
        res.redirect("/settings")

    }catch (error) {
      console.log(error)
      req.session.message = "error completing request";
      res.redirect("/settings");
    }
}

// change dp
const changePhoto = async (req, res) => {
  try {
    let data = await generateUploadURL(req.file)
    const photo = data.uploadUrl
  
    const user = await User.updateOne({ email: req.body.email }, 
      {
        $set:{
            photo: photo
        }
      }
    )
    
    if(user !== null){
        req.session.message = "picture updated";
        res.redirect("/settings");
    }else{
      req.session.message = "error updating picture";
      res.redirect("/settings")
    }
  } catch (error) {
    console.log(error)
    req.session.message = "error completing request";
    res.redirect("/settings")
  }
}

module.exports = {
  Signup,
  otpAuth,
  login,
  resendOtp,
  verifyOtp,
  sendOtp,
  resetPassword,
  depositSub,
  walletSub,
  deleteWalletSub,
  withdrawalSub,
  submitKyc,
  settingsSub,
  changePassSub,
  changePhoto,
  deleteTransactionSub,
  tradeSub
};
