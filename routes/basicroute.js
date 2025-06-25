const express = require("express");
const {
  Signup,
  otpAuth,
  resendOtp,
  login,
  verifyOtp,
  resetPassword,
  sendOtp,
  submitKyc,
  depositSub,
  walletSub,
  deleteWalletSub,
  withdrawalSub,
  settingsSub,
  changePassSub,
  changePhoto
} = require("../controllers/basiccontroller");
const router = express.Router();
const { isLogin, isLogout } = require("../middlewares/auth");
const { uploads, uploadsFour } = require("../middlewares/uploads");
const Wallet = require("../models/usermodel/userwallets");
const Withdraw = require("../models/usermodel/withdraw");
const User = require("../models/usermodel/signup");

router.get("/", isLogout, async (req, res) => {
  res.render("user/index", {
    title: "Apex Meridian - Home",
    page: "Home",
    loaded: "Home",
    title: "Apex Meridian - Home",
    page: "Home",
    loaded: "Home",
  });
});

router.get("/deposit", isLogin, async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  res.render("user/deposit", {
    title: "Apex Meridian - deposit",
    page: "deposit",
    loaded: "deposit",
    message,
    userEmail: req.session.user.email,
  });
});

router.get("/markets", isLogin, async (req, res) => {
  res.render("user/markets", {
    title: "Apex Meridian - markets",
    page: "markets",
    loaded: "markets",
  });
});

router.get("/settings", isLogin, async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  const user = await User.findOne({ email: req.session.user.email });

  res.render("user/settings", {
    title: "Apex Meridian - settings",
    page: "settings",
    loaded: "settings",
    message,
    user: user
  });
});

router.get("/trade", isLogin, async (req, res) => {
  res.render("user/trade", {
    title: "Apex Meridian - trade",
    page: "trade",
    loaded: "trade",
  });
});

router.get("/trades", isLogin, async (req, res) => {
  res.render("user/opentrades", {
    title: "Apex Meridian - trades",
    page: "trades",
    loaded: "trades",
  });
});

router.get("/tradeshistory", isLogin, async (req, res) => {
  res.render("user/tradeshistory", {
    title: "Apex Meridian - trades",
    page: "trades",
    loaded: "trades",
  });
});

router.get("/transactions", isLogin, async (req, res) => {
  res.render("user/transactions", {
    title: "Apex Meridian - transactions",
    page: "transactions",
    loaded: "transactions",
  });
});

router.get("/wallets", isLogin, async (req, res) => {
  try {
    const message = req.session.message;
    req.session.message = null;

    let wallets = await Wallet.find({ email: req.session.user.email });

    res.render("user/wallets", {
      title: "Apex Meridian - wallets",
      page: "wallets",
      loaded: "wallets",
      message,
      userEmail: req.session.user.email,
      wallets,
    });
  } catch (error) {
    console.log(error);
    req.session.message = "error completing request";
    res.redirect("/wallets");
  }
});

router.get("/withdrawals", isLogin, async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  let wallets = await Wallet.find({ email: req.session.user.email });
  let withdrawals = await Withdraw.find({ email: req.session.user.email });

  res.render("user/withdrawals", {
    title: "Apex Meridian - withdrawals",
    page: "withdrawals",
    loaded: "withdrawals",
    message,
    userEmail: req.session.user.email,
    wallets,
    withdrawals,
  });
});

router.get("/analytics", isLogin, async (req, res) => {
  res.render("user/analytics", {
    title: "Apex Meridian - analytics",
    page: "analytics",
    loaded: "analytics",
  });
});

router.get("/login", isLogout, async (req, res) => {
  res.render("user/login", {
    title: "Apex Meridian - Login",
    page: "Login",
    loaded: "Login",
  });
});

router.get("/signup", isLogout, async (req, res) => {
  res.render("user/signup", {
    title: "Apex Meridian - Signup",
    page: "SignUp",
    loaded: "SignUp",
  });
});

router.get("/otp", async (req, res) => {
  res.render("user/otp", {
    title: "Apex Meridian - Auth",
    page: "Otp",
    loaded: "Otp",
  });
});

router.get("/kycverification", async (req, res) => {
  res.render("user/kycverification", {
    title: "Apex Meridian - Auth",
    page: "Otp",
    loaded: "Otp",
  });
});

router.post("/signup", Signup);
router.post("/", login);
router.post("/otp", otpAuth);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/get-reset-otp", sendOtp);
router.post("/reset-password", resetPassword);
router.post("/verification/submit", submitKyc);

router.post("/deposit", uploads.single("file"), depositSub);
router.post("/withdrawals", withdrawalSub);

router.post("/wallets", walletSub);
router.get("/deletewallet/:id", deleteWalletSub);


router.post("/settings", settingsSub);
router.post("/changepass", changePassSub);
router.post("/changephoto", uploadsFour.single("file"), changePhoto);







router.get("/resetpassword", isLogout, async (req, res) => {
  res.render("user/resetpassword", {
    title: "Apex Meridian - Auth",
    page: "Resetpassword",
    loaded: "Resetpassword",
  });
});

router.get("/dashboard", isLogin, async (req, res) => {
  res.render("user/dashboard", {
    title: "Apex Meridian - Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out." });
    }
    res.clearCookie("connect.sid");
    res.status(200).redirect("/");
  });
});
module.exports = router;
