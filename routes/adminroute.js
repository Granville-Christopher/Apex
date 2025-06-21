const express = require("express");
const { Signup, Login } = require("../controllers/admincontroller");
const router = express.Router();


router.get("/", async (req, res) => {

  res.render("admin/index", {
    title: "Apex Meridian - Admin Login",
    page: "Login",
    loaded: "Login",
  });
});

router.get("/login", async (req, res) => {

  res.render("admin/login", {
    title: "Apex Meridian - Admin Login",
    page: "Login",
    loaded: "Login",
  });
});

router.get("/signup", async (req, res) => {

  res.render("admin/signup", {
    title: "Apex Meridian - Admin Signup",
    page: "SignUp",
    loaded: "SignUp",
  });
});

router.post("/admin-signup", Signup)
router.post("/admin-login", Login)

router.get("/resetpassword", async (req, res) => {

  res.render("admin/resetpassword", {
    title: "Apex Meridian - Admin resetpassword",
    page: "resetpassword",
    loaded: "resetpassword",
  });
});

router.get("/dashboard", async (req, res) => {

  res.render("admin/dashboard", {
    title: "Apex Meridian - Admin Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
  });
});


module.exports = router;
