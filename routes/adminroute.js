const express = require("express");
const {
  Signup,
  Login,
  sendOtp,
  resetPassword,
  uploadWallets,
  editBal,
  manipulateTrade,
  adminTradeSubmit,
} = require("../controllers/admincontroller");
const router = express.Router();
const { isAdminLogin, isAdminLogout } = require("../middlewares/auth");
const User = require("../models/usermodel/signup");
const Deposit = require("../models/usermodel/deposit");
const Wallet = require("../models/usermodel/userwallets");
const AdminWallet = require("../models/adminmodel/wallet");
const Withdraw = require("../models/usermodel/withdraw");
const Trade = require("../models/usermodel/trade");
const Kyc = require("../models/usermodel/kyc");
const { upload } = require("../middlewares/uploads");
const Message = require("../models/usermodel/message");
const mongoose = require("mongoose");
const sendDepositApprovalEmail = require("../config/approveddeposit");
const {
  getUserConversation,
  adminReply,
} = require("../controllers/messagecontroller");
const AdminTrade = require("../models/adminmodel/copytrades");

router.get("/", isAdminLogin, async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  let users = await User.find();
  let wallets = await AdminWallet.find();
  let deposits = await Deposit.find();
  let withdraws = await Withdraw.find();

  res.render("admin/index", {
    title: "Apex Meridian - Admin Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
    users,
    wallets,
    message,
    deposits,
    withdraws,
  });
});

router.get("/chatting/:userId", getUserConversation);
router.post("/chatting/respond/:userId", adminReply);

router.post("/tradeadmin", adminTradeSubmit);

router.delete("/trades/:id", async (req, res) => {
  try {
    const tradeId = req.params.id;

    const deletedTrade = await AdminTrade.findByIdAndDelete(tradeId);

    if (!deletedTrade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    res.status(201).json({ message: "Trade deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/tradeadmins", isAdminLogin, async (req, res) => {
  try {
    const trades = await AdminTrade.find().sort({ createdAt: -1 });
    res.render("admin/tradeadmin", {
      title: "Apex Meridian - Admin Trade",
      page: "TradeAdmin",
      loaded: "TradeAdmin",
      trades,
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find({}, "name email _id").sort({ name: 1 });
    // The second argument 'name email _id' limits the returned fields
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/chats", async (req, res) => {
  try {
    // const conversations = await Message.find().populate("user").sort({ updatedAt: -1 });

    res.render("admin/adminmessages", {
      title: "Apex Meridian - Admin Messages",
      page: "AdminMessages",
      loaded: "AdminMessages",
      // conversations,
    });
  } catch (error) {
    console.error("❌ Failed to load admin messages:", error);
    res.status(500).send("Error loading admin messages");
  }
});

// router.get("/admin/users/messages",  )

router.get("/login", isAdminLogout, async (req, res) => {
  res.render("admin/login", {
    title: "Apex Meridian - Admin Login",
    page: "Login",
    loaded: "Login",
  });
});

router.get("/messages", async (req, res) => {
  try {
    res.render("admin/messages", {
      title: "Apex Meridian - Admin Messages",
      page: "Messages",
      loaded: "Messages",
      // users,
    });
  } catch (err) {
    console.error("❌ Failed to load messages:", err);
    res.status(500).send("Error loading messages");
  }
});

router.get("/messagestwo", async (req, res) => {
  try {
    const latestSenders = await Message.aggregate([
      { $match: { sender: { $ne: "admin" } } },
      {
        $group: {
          _id: "$sender",
          latestTimestamp: { $max: "$timestamp" },
        },
      },
      { $sort: { latestTimestamp: -1 } },
    ]);

    const senderIds = latestSenders.map((u) => u._id);

    const users = await User.find({ _id: { $in: senderIds } }).lean();

    const usersMap = new Map(users.map((u) => [u._id.toString(), u]));
    const sortedUsers = senderIds
      .map((id) => usersMap.get(id.toString()))
      .filter(Boolean);

    res.json(sortedUsers);
  } catch (err) {
    console.error("❌ Failed to load messages:", err);
    res.status(500).send("Error loading messages");
  }
});

router.get("/messages/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { sender: "admin", to: userId }],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/messages/reply", async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  res.json({ success: true });
});

// router.post("/messages/reply", async (req, res) => {
//   const { to, message } = req.body;

//   if (!to || !message) {
//     return res.status(400).json({ success: false, message: "Missing fields" });
//   }

//   try {
//     const newMsg = new Message({
//       sender: "admin",
//       to: to, // ✅ This should be the _id from the user's list, NOT the name
//       message,
//     });

//     await newMsg.save();
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.get("/signup", isAdminLogout, async (req, res) => {
  res.render("admin/signup", {
    title: "Apex Meridian - Admin Signup",
    page: "SignUp",
    loaded: "SignUp",
  });
});

// get user trades
router.get("/trades/:email", isAdminLogin, async (req, res) => {
  let email = req.params.email;
  let user = await User.findOne({ email });
  const trades = await Trade.find({ email });

  res.render("admin/usertrade", {
    title: "Apex Meridian - Admin User Trades",
    page: "usertrades",
    loaded: "usertrades",
    user,
    trades,
  });
});

// get single trade
router.get("/updatetrade/:email/:id", isAdminLogin, async (req, res) => {
  let email = req.params.email;
  let id = req.params.id;
  const message = req.session.message;
  req.session.message = null;

  let user = await User.findOne({ email });
  const trade = await Trade.findOne({ _id: id });

  res.render("admin/usersingletrade", {
    title: "Apex Meridian - Admin User Trade",
    page: "usertrade",
    loaded: "usertrade",
    user,
    trade,
    message,
  });
});

// get single user
router.get("/usersingle/:email", isAdminLogin, async (req, res) => {
  let email = req.params.email;

  let user = await User.findOne({ email });
  let kyc = await Kyc.findOne({ userId: user._id });

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

  res.render("admin/usersingle", {
    title: "Apex Meridian - Admin usersingle",
    page: "usersingle",
    loaded: "usersingle",
    user,
    kyc,
    transactions,
  });
});

// approve and reject kyc
router.get("/kyc/:email/:id", isAdminLogin, async (req, res) => {
  let email = req.params.email;
  let id = req.params.id;
  let type = req.query.type;

  if (type == "approve") {
    await Kyc.updateOne(
      { _id: id },
      {
        $set: {
          status: "approved",
        },
      }
    );
  } else {
    await Kyc.updateOne(
      { _id: id },
      {
        $set: {
          status: "rejected",
        },
      }
    );
  }

  res.redirect(`/admin/usersingle/${email}`);
});

// block and unblock user
router.get("/blockuser/:email", isAdminLogin, async (req, res) => {
  let email = req.params.email;
  let id = req.params.id;
  let type = req.query.type;

  if (type == "block") {
    await User.updateOne(
      { email },
      {
        $set: {
          block: true,
        },
      }
    );
  } else {
    await User.updateOne(
      { email },
      {
        $set: {
          block: false,
        },
      }
    );
  }

  res.redirect(`/admin/usersingle/${email}`);
});

router.post("/admin-signup", Signup);
router.post("/admin-login", Login);
router.post("/get-reset-otp", sendOtp);
router.post("/resetpassword", resetPassword);

router.post("/wallets", upload.single("walletQRCode"), uploadWallets);
router.post("/upbalance", editBal);
router.post("/manipulate", manipulateTrade);

// live search
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || "";

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/resetpassword", isAdminLogout, async (req, res) => {
  res.render("admin/resetpassword", {
    title: "Apex Meridian - Admin resetpassword",
    page: "resetpassword",
    loaded: "resetpassword",
  });
});

// delete wallet
router.get("/deletewallet/:id", isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      res.redirect("/");
    }

    await AdminWallet.deleteOne({ _id: id });

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
});

// delete deposit
router.get("/deletedeposit/:id", isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      res.redirect("/");
    }

    await Deposit.deleteOne({ _id: id });

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
});

// delete withdrawal
router.get("/deletewith/:id", isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      res.redirect("/");
    }

    await Withdraw.deleteOne({ _id: id });

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
});

// approve withdrawal
router.get("/approvewithdraw/:id", isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      res.redirect("/");
    }

    await Withdraw.updateOne(
      { _id: id },
      {
        $set: {
          status: 1,
        },
      }
    );

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
});

// approve deposit
router.get("/approvedeposit/:id", isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;
    let email = req.query.email;
    let amount = Number(req.query.amount);

    let user = await User.findOne({ email });

    if (!id) {
      res.redirect("/");
    }

    await Deposit.updateOne(
      { _id: id },
      {
        $set: {
          status: 1,
        },
      }
    );

    user.balance += amount;

    user.save();
    try {
      await sendDepositApprovalEmail(email, amount);
      console.log(`Approval email sent to ${email} for $${amount}`);
    } catch (err) {
      console.error("Failed to send deposit approval email:", err);
    }

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
});

module.exports = router;
