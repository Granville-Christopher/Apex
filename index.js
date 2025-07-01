const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const basicRoute = require("./routes/basicroute");
const adminRoute = require("./routes/adminroute");

const app = express();

const http = require("http").createServer(app);
const setupSocket = require("./socket");
const { io, connectedUsers } = setupSocket(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 3000;
    http.listen(PORT, () => {
      console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
    });
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
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DBURI,
      collectionName: "sessions",
    }),
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentUrl = req.originalUrl;
  next();
});

app.use("/", basicRoute);
app.use("/admin", adminRoute);

app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "sitemap.xml"));
});

app.use((req, res, next) => {
  res.status(404).render("404", { title: "404" });
});

module.exports = { io, connectedUsers };
