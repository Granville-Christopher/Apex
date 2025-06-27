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
  changePhoto,
  deleteTransactionSub,
  tradeSub
} = require("../controllers/basiccontroller");
const router = express.Router();
const { isLogin, isLogout } = require("../middlewares/auth");
const upload = require("../middlewares/uploads");
const Wallet = require("../models/usermodel/userwallets");
const Withdraw = require("../models/usermodel/withdraw");
const Deposit = require("../models/usermodel/deposit");
const Trade = require("../models/usermodel/trade");
const User = require("../models/usermodel/signup");
const AdminWallet = require("../models/adminmodel/wallet");

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
  const wallet = await AdminWallet.aggregate([{ $sample: { size: 1 } }]);
  const user = await User.findOne({ email: req.session.user.email });

  res.render("user/deposit", {
    title: "Apex Meridian - deposit",
    page: "deposit",
    loaded: "deposit",
    message,
    user,
    wallet: wallet[0]
  });
});

router.get("/markets", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });

  res.render("user/markets", {
    title: "Apex Meridian - markets",
    page: "markets",
    loaded: "markets",
    user,
  });
});

router.get("/settings", isLogin, async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  const user = await User.findOne({ email: req.session.user.email });

  const totalDepositResult = await Deposit.aggregate([
    { $match: { email: req.session.user.email, status: 1 } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalDeposit = totalDepositResult[0]?.total || 0;

  const totalWithdrawResult = await Withdraw.aggregate([
    { $match: { email: req.session.user.email, status: 1 } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalWithdraw = totalWithdrawResult[0]?.total || 0;


  res.render("user/settings", {
    title: "Apex Meridian - settings",
    page: "settings",
    loaded: "settings",
    message,
    user,
    totalWithdraw,
    totalDeposit
  });
});

router.get("/trade", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });

  res.render("user/trade", {
    title: "Apex Meridian - trade",
    page: "trade",
    loaded: "trade",
    user
  });
});

router.get("/trades", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });
  
  const trades = await Trade.find({ email: req.session.user.email });

  res.render("user/opentrades", {
    title: "Apex Meridian - trades",
    page: "trades",
    loaded: "trades",
    user,
    trades
  });
});

router.get("/tradeshistory", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });

  const trades = await Trade.find({ email: req.session.user.email, status: "Closed" });

  res.render("user/tradeshistory", {
    title: "Apex Meridian - trades",
    page: "trades",
    loaded: "trades",
    user,
    trades
  });
});

router.get("/transactions", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });

  const deposits = await Deposit.find({ email: user.email });
  const withdrawals = await Withdraw.find({ email: user.email });

  const transactions = [
    ...deposits.map((d) => ({
      id: d._id,
      type: "Deposit",
      date: d.createddate || "",
      amount: d.amount,
      status: d.status,
    })),
    ...withdrawals.map((w) => ({
      id: w._id,
      type: "Withdrawal",
      date: w.createddate || "",
      amount: w.amount,
      status: w.status,
    })),
  ];

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render("user/transactions", {
    title: "Apex Meridian - transactions",
    page: "transactions",
    loaded: "transactions",
    user,
    transactions
  });
});

router.get("/wallets", isLogin, async (req, res) => {
  try {
    const message = req.session.message;
    req.session.message = null;

    const user = await User.findOne({ email: req.session.user.email });
    let wallets = await Wallet.find({ email: req.session.user.email });

    res.render("user/wallets", {
      title: "Apex Meridian - wallets",
      page: "wallets",
      loaded: "wallets",
      message,
      user,
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

  const user = await User.findOne({ email: req.session.user.email });
  let wallets = await Wallet.find({ email: req.session.user.email });
  let withdrawals = await Withdraw.find({ email: req.session.user.email });

  res.render("user/withdrawals", {
    title: "Apex Meridian - withdrawals",
    page: "withdrawals",
    loaded: "withdrawals",
    message,
    user,
    wallets,
    withdrawals,
  });
});

router.get("/analytics", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });

  // get profits & loss
  const totalProfitResult = await Trade.aggregate([
    { $match: { email: req.session.user.email, pnl: "Profit" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalProfit = totalProfitResult[0]?.total || 0;

  const totalLossResult = await Trade.aggregate([
    { $match: { email: req.session.user.email, pnl: "Loss" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalLoss = totalLossResult[0]?.total || 0;

  res.render("user/analytics", {
    title: "Apex Meridian - analytics",
    page: "analytics",
    loaded: "analytics",
    user,
    totalProfit,
    totalLoss
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

// cancel withdrawal
router.get("/cancelwith/:id/:amount", async (req, res) => {
  let id = req.params.id
  let amount = Number(req.params.amount)

  const user = await User.findOne({ email });
  user.balance += amount
  await user.save()


  await Withdraw.deleteOne({ _id: id });
  res.redirect("/withdrawals");
});

router.post("/signup", Signup);
router.post("/", login);
router.post("/otp", otpAuth);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/get-reset-otp", sendOtp);
router.post("/reset-password", resetPassword);
router.post("/verification/submit", submitKyc);

router.post("/deposit", upload.single("file"), depositSub);
router.post("/withdrawals", withdrawalSub);

router.post("/wallets", walletSub);
router.get("/deletewallet/:id", deleteWalletSub);


router.get("/deletetxn/:id", deleteTransactionSub);


router.post("/settings", settingsSub);
router.post("/changepass", changePassSub);
router.post("/changephoto", upload.single("file"), changePhoto);


router.post("/trade", tradeSub);





router.get("/resetpassword", isLogout, async (req, res) => {
  res.render("user/resetpassword", {
    title: "Apex Meridian - Auth",
    page: "Resetpassword",
    loaded: "Resetpassword",
  });
});

router.get("/dashboard", isLogin, async (req, res) => {
  const user = await User.findOne({ email: req.session.user.email });

  const totalDepositResult = await Deposit.aggregate([
    { $match: { email: req.session.user.email, status: 1 } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalDeposit = totalDepositResult[0]?.total || 0;

  const totalWithdrawResult = await Withdraw.aggregate([
    { $match: { email: req.session.user.email, status: 1 } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalWithdraw = totalWithdrawResult[0]?.total || 0;

  // get profits & loss
  const totalProfitResult = await Trade.aggregate([
    { $match: { email: req.session.user.email, pnl: "Profit" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalProfit = totalProfitResult[0]?.total || 0;

  const totalLossResult = await Trade.aggregate([
    { $match: { email: req.session.user.email, pnl: "Loss" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ])
  const totalLoss = totalLossResult[0]?.total || 0;

  res.render("user/dashboard", {
    title: "Apex Meridian - Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
    user,
    deposit: totalDeposit,
    withdrawal: totalWithdraw,
    profits: totalProfit,
    loss: totalLoss
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out." });
    }
    res.clearCookie("connect.sid");
    res.status(200).redirect("/");
  });
});
module.exports = router;
