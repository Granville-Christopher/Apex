const express = require("express");
const { Signup, Login, sendOtp, resetPassword, uploadWallets } = require("../controllers/admincontroller");
const router = express.Router();
const { isAdminLogin, isAdminLogout } = require("../middlewares/auth");
const User = require("../models/usermodel/signup");
const Deposit = require("../models/usermodel/deposit");
const Wallet = require("../models/usermodel/userwallets");
const AdminWallet = require("../models/adminmodel/wallet");
const Withdraw = require("../models/usermodel/withdraw");
const Trade = require("../models/usermodel/trade");
const Kyc = require("../models/usermodel/kyc");
const { uploadsThree } = require("../middlewares/uploads");


router.get("/", isAdminLogin, async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  let users = await User.find()
  let wallets = await AdminWallet.find()
  let deposits = await Deposit.find()
  let withdraws = await Withdraw.find()

  res.render("admin/index", {
    title: "Apex Meridian - Admin Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
    users,
    wallets,
    message,
    deposits,
    withdraws
  });
});

router.get("/login", isAdminLogout, async (req, res) => {

  res.render("admin/login", {
    title: "Apex Meridian - Admin Login",
    page: "Login",
    loaded: "Login",
  });
});

router.get("/signup", isAdminLogout, async (req, res) => {

  res.render("admin/signup", {
    title: "Apex Meridian - Admin Signup",
    page: "SignUp",
    loaded: "SignUp",
  });
});

router.get("/usersingle/:email", isAdminLogin, async (req, res) => {
  let email = req.params.email

  let user = await User.findOne({ email })

  res.render("admin/usersingle", {
    title: "Apex Meridian - Admin usersingle",
    page: "usersingle",
    loaded: "usersingle",
    user
  });
});

router.post("/admin-signup", Signup)
router.post("/admin-login", Login)
router.post("/get-reset-otp", sendOtp)
router.post("/resetpassword", resetPassword )


router.post("/wallets", uploadsThree.single("walletQRCode"), uploadWallets)


router.get("/resetpassword", isAdminLogout, async (req, res) => {

  res.render("admin/resetpassword", {
    title: "Apex Meridian - Admin resetpassword",
    page: "resetpassword",
    loaded: "resetpassword",
  });
});

// delete wallet
router.get('/deletewallet/:id' , isAdminLogin, async (req, res) => {
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
})

// delete deposit
router.get('/deletedeposit/:id' , isAdminLogin, async (req, res) => {
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
})

// approve withdrawal
router.get('/approvewithdraw/:id' , isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      res.redirect("/");
    }

    await Withdraw.updateOne({ _id: id }, 
        {
            $set:{
                status: 1
            }
        }
    )

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
})

// approve deposit
router.get('/approvedeposit/:id' , isAdminLogin, async (req, res) => {
  try {
    let id = req.params.id;
    let email = req.query.email
    let amount = Number(req.query.amount)

    if (!id) {
      res.redirect("/");
    }

    
    await Deposit.updateOne({ _id: id }, 
        {
            $set:{
                status: 1
            }
        }
    )

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/");
  }
})

// router.get("/dashboard", isAdminLogin, async (req, res) => {

//   res.render("admin/dashboard", {
//     title: "Apex Meridian - Admin Dashboard",
//     page: "Dashboard",
//     loaded: "Dashboard",
//   });
// });


module.exports = router;
