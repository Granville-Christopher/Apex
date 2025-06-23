const express = require("express");
const { Signup, otpAuth, resendOtp, login, verifyOtp, resetPassword, sendOtp } = require("../controllers/basiccontroller");
const router = express.Router();

router.get("/", async (req, res) => {

  res.render("user/index", {
    title: "Apex Meridian - Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
  });
});
router.get("/login", async (req, res) => {

  res.render("user/login", {
    title: "Apex Meridian - Login",
    page: "Login",
    loaded: "Login",
  });
});

router.get("/signup", async (req, res) => {

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

router.post("/signup", Signup)
router.post("/", login)
router.post("/otp", otpAuth)
router.post("/resend-otp", resendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/get-reset-otp", sendOtp)
router.post("/reset-password", resetPassword)




router.get("/resetpassword", async (req, res) => {

  res.render("user/resetpassword", {
    title: "Apex Meridian - Auth",
    page: "Resetpassword",
    loaded: "Resetpassword",
  });
});

router.get("/dashboard", async (req, res) => {

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
    res.clearCookie("connect.sid"); // optional
    res.status(200).json({ message: "Logged out successfully" });
  });
});
module.exports = router;
