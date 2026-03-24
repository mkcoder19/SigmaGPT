import express from "express";
import Thread from "../models/Thread.js";
import getAIResponse from "../utils/openai.js"; 
import authMiddleware from "./middleware.js";

const router = express.Router();

router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(threads);
  } catch (err) {
    console.log("Failed to fetch threads", err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log("Failed to fetch thread", err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOneAndDelete({
      threadId,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log("Failed to delete thread", err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", authMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.user._id,
    });

    // ✅ Create new thread if not exists
    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.user._id,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // ✅ CLEAN messages (remove _id etc.)
    const cleanMessages = thread.messages
      .slice(-10) // limit history (performance + cost)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    // ✅ Call Groq API
    const assistantReply = await getAIResponse([
      {
        role: "system",
        content:
          "You are SigmaGPT, an AI tutor that explains concepts clearly and helps students learn step-by-step.",
      },
      ...cleanMessages,
    ]);

    // ✅ Safety check
    if (!assistantReply) {
      throw new Error("Empty AI response");
    }

    // ✅ Save assistant reply
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });

  } catch (err) {
    console.error("Chat endpoint error:", err.message || err);

    if (err.message?.includes("429")) {
      return res.status(429).json({
        error: "AI is busy right now. Try again later.",
      });
    }

    res.status(500).json({ error: err.message || "Chat failed" });
  }
});

export default router;