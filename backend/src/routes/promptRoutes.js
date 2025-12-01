import express from "express";
import { Prompt } from "../models/Prompt.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

// GET /api/me/prompts - Get all prompts for the authenticated user
router.get("/me/prompts", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const prompts = await Prompt.find({ userId: uid }).sort({ lastUsed: -1 });
    return res.json({ prompts });
  } catch (err) {
    console.error("Error fetching prompts:", err);
    return res.status(500).json({ error: "Server error while fetching prompts" });
  }
});

// POST /api/me/prompts - Create a new prompt
router.post("/me/prompts", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const { title, searchQuery } = req.body;

    if (!title || !searchQuery) {
      return res.status(400).json({ error: "Title and searchQuery are required" });
    }

    const prompt = new Prompt({
      userId: uid,
      title,
      searchQuery,
    });

    await prompt.save();
    return res.json({ prompt });
  } catch (err) {
    console.error("Error creating prompt:", err);
    return res.status(500).json({ error: "Server error while creating prompt" });
  }
});

// PUT /api/me/prompts/:id - Update a prompt
router.put("/me/prompts/:id", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const { id } = req.params;
    const { title, searchQuery } = req.body;

    const prompt = await Prompt.findOne({ _id: id, userId: uid });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    if (title) prompt.title = title;
    if (searchQuery) prompt.searchQuery = searchQuery;
    prompt.lastUsed = new Date();

    await prompt.save();
    return res.json({ prompt });
  } catch (err) {
    console.error("Error updating prompt:", err);
    return res.status(500).json({ error: "Server error while updating prompt" });
  }
});

// DELETE /api/me/prompts/:id - Delete a prompt
router.delete("/me/prompts/:id", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const { id } = req.params;

    const result = await Prompt.deleteOne({ _id: id, userId: uid });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting prompt:", err);
    return res.status(500).json({ error: "Server error while deleting prompt" });
  }
});

// PATCH /api/me/prompts/:id/use - Update lastUsed timestamp
router.patch("/me/prompts/:id/use", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const { id } = req.params;

    const prompt = await Prompt.findOne({ _id: id, userId: uid });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    prompt.lastUsed = new Date();
    await prompt.save();

    return res.json({ prompt });
  } catch (err) {
    console.error("Error updating prompt usage:", err);
    return res.status(500).json({ error: "Server error while updating prompt" });
  }
});

export default router;
