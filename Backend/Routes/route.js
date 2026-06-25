import express from "express";
import Thread from "../models/threads.js";
import aires from "../utils/Ai.js";
import generateImage from "../utils/ImageAi.js";
import voiceRoute from "./voiceRoute.js";
import { isLoggedIn } from "../utils/middleware.js"; // Added auth middleware

const router = express.Router();
router.use("/voice", voiceRoute);

// ─── TEST ROUTE (SECURED) ────────────────────────────────────────────────────
router.post("/test", isLoggedIn, async (req, res) => {
  try {
    const thread = new Thread({
      thread_id: "yedb73",
      userId: req.user._id, // Locked to logged-in user
      title: "repeating numbers"
    });

    let response = await thread.save();
    res.status(201).json({
      success: true,
      data: response
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "failed to save in database" });
  }
});

// ─── GET CHAT HISTORY FOR SIDEBAR (NEW) ──────────────────────────────────────
router.get("/chat/history", isLoggedIn, async (req, res) => {
  try {
    // Find all threads for THIS user, sorted newest first
    const threads = await Thread.find({ userId: req.user._id }).sort({ Updated_at: -1 });
    res.json({ success: true, threads });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "failed to get data" });
  }
});

// ─── GET ALL THREADS (LEGACY ROUTE, SECURED) ─────────────────────────────────
router.get("/thread", isLoggedIn, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id }).sort({ Updated_at: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to get data" });
  }
});

// ─── GET MESSAGES FOR A SPECIFIC THREAD ──────────────────────────────────────
router.get("/thread/:thread_id", isLoggedIn, async (req, res) => {
  const { thread_id } = req.params;

  try {
    // Only find the thread if it belongs to the logged-in user
    const thread = await Thread.findOne({ thread_id, userId: req.user._id });

    if (!thread) {
      return res.status(404).json({
        error: "there is no thread in database"
      });
    }

    return res.json({
      messages: thread.Messages
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: "can't get thread"
    });
  }
});

// ─── DELETE A THREAD ─────────────────────────────────────────────────────────
router.delete("/thread/:thread_id", isLoggedIn, async (req, res) => {
  const { thread_id } = req.params;

  try {
    // Only delete if the thread belongs to the logged-in user
    const thread = await Thread.findOneAndDelete({ thread_id, userId: req.user._id });

    if (!thread) {
      return res.status(404).json({
        success: false,
        error: "Thread not found",
      });
    }

    return res.json({
      success: true,
      deletedThread: thread,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Can't delete thread",
    });
  }
});

// ─── SEND A MESSAGE AND GET AI REPLY ─────────────────────────────────────────
router.post("/chat", isLoggedIn, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    let { thread_id, prompt } = req.body;
    
    if (!thread_id || !prompt) {
      return res.status(400).json({
        error: "thread_id and prompt are required"
      });
    }

    const userId = req.user._id;

    // Securely check if the thread exists for this user
    let thread = await Thread.findOne({ thread_id, userId });

    if (!thread) {
      // Create short title from the first prompt
      const shortTitle = prompt.substring(0, 30) + (prompt.length > 30 ? "..." : "");

      thread = new Thread({
        thread_id,
        userId, // Attach the user ID
        title: shortTitle,
        Messages: [
          {
            role: "user",
            message: prompt
          }
        ]
      });
    } else {
      thread.Messages.push({
        role: "user",
        message: prompt
      });
    }

    // Call your AI
    const airesponse = await aires(prompt);

    console.log("AI Response:", airesponse);

    if (!airesponse.success) {
      return res.status(500).json({
        error: airesponse.error
      });
    }

    // Save AI reply
    thread.Messages.push({
      role: "assistant",
      message: airesponse.reply
    });

    thread.Updated_at = new Date();
    await thread.save();
    
    return res.json({
      reply: airesponse.reply
    });

  } catch (err) {
    console.error("Chat Route Error:", err);
    return res.status(500).json({
      error: err.message
    });
  }
});

export default router;