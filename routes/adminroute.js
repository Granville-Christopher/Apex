const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

  res.render("admin/index", {
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

router.get("/dashboard", async (req, res) => {

  res.render("admin/dashboard", {
    title: "Apex Meridian - Admin Dashboard",
    page: "Dashboard",
    loaded: "Dashboard",
  });
});


module.exports = router;
