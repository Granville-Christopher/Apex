const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const basicRoute = require("./routes/basicroute");
const adminRoute = require("./routes/adminroute");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const dbURI = process.env.DBURI;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,   
      httpOnly: true,
    },
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentUrl = req.originalUrl;
  next();
});

app.use("/", basicRoute);
app.use("/admin", adminRoute);

app.use((req, res, next) => {
  res.status(404).render("404", { title: "404" });
});
