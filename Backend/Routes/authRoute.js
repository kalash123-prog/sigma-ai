import express from "express";
import passport from "passport";
import User from "../models/User.js";
import { isLoggedIn } from "../utils/middleware.js";

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user and log them in instantly
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Create user without ANY verification tokens
    const newUser = new User({ email, username });

    // Passport hashes the password and saves to DB
    const registeredUser = await User.register(newUser, password);

    // Auto-login instantly after they create an account
    req.login(registeredUser, (err) => {
      if (err) return res.status(500).json({ success: false, message: "Login after signup failed" });
      
      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        user: {
          id: registeredUser._id,
          email: registeredUser.email,
          username: registeredUser.username,
        },
      });
    });

  } catch (err) {
    if (err.name === "UserExistsError") {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user directly
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });
    }
    
    req.login(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ success: false, message: "Login failed" });
      return res.json({
        success: true,
        message: "Logged in successfully!",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    });
  })(req, res, next);
});

// @route   POST /api/auth/logout
// @desc    Logout user
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    req.session.destroy((sessionErr) => {
      if (sessionErr) return res.status(500).json({ success: false, message: "Session destroy failed" });
      res.clearCookie("connect.sid");
      return res.json({ success: true, message: "Logged out successfully" });
    });
  });
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
router.get("/me", isLoggedIn, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    },
  });
});

// @route   GET /api/auth/check
// @desc    Check if user is authenticated (silent check)
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
      },
    });
  }
  res.json({ authenticated: false });
});

export default router;