import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import { Strategy as PassportLocal } from "passport-local";


// Local Route Imports (Note the .js extension required for ES Modules)
import chatRoute from "./Routes/route.js";
import imageRoute from "./Routes/imageRoute.js";
import voiceRoute from "./Routes/voiceRoute.js";
import authRoute from "./Routes/authRoute.js";
import User from "./models/User.js";

// ─── Configuration ────────────────────────────────────────────────────────────
dotenv.config();
console.log("Checking Link:", process.env.MONGO_URL);
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── Basic Middleware ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allow cookies to be sent cross-origin
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session Store & Config ───────────────────────────────────────────────────
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: { secret: process.env.SESSION_SECRET || "fallback-secret" },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => console.error("Session store error:", err));

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(flash());

// ─── Passport Config ──────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ─── Global Variables Middleware ──────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
// Health check route
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Feature routes
app.use("/api", chatRoute);
app.use("/api", imageRoute);
app.use("/api/voice", voiceRoute);
app.use("/api/auth", authRoute);

// ─── Error Handling ───────────────────────────────────────────────────────────
// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global Error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));