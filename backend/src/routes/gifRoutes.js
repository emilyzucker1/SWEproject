import express from "express";
import axios from "axios";
import { User } from "../models/User.js";
import { verifyToken, ensureSelfParam } from "../middleware/authentication.js";

const router = express.Router();

// Shared Tenor search helper
async function searchTenor(params) {
  if (!process.env.TENOR_API_KEY) {
    throw Object.assign(new Error("TENOR_API_KEY missing"), { status: 500 });
  }
  const TENOR_SEARCH_URL = "https://tenor.googleapis.com/v2/search";
  const { data } = await axios.get(TENOR_SEARCH_URL, {
    params: { key: process.env.TENOR_API_KEY, ...params },
  });
  return data;
}

// POST /api/me/gifs  -> search Tenor, save first usable URL into user's gifs
router.post("/me/gifs", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;

    const {
      q,
      client_key = process.env.TENOR_CLIENT_KEY,
      country = "US",
      locale = "en_US",
      contentfilter = "low",
      media_filter = "gif,tinygif",
      ar_range = "all",
      random = false,
      limit = 1,
      searchfilter,
      pos,
    } = req.body || {};

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Missing required 'q' (search string)" });
    }

    const tenorParams = {
      q,
      client_key,
      country,
      locale,
      contentfilter,
      media_filter,
      ar_range,
      random,
      limit,
    };
    if (searchfilter) tenorParams.searchfilter = searchfilter;
    if (pos) tenorParams.pos = pos;

    const data = await searchTenor(tenorParams);
    const results = data?.results || [];
    if (!results.length) return res.status(404).json({ error: "No Tenor results for that query" });

    const media = results[0]?.media_formats || {};
    const pickedUrl =
      media?.gif?.url ||
      media?.tinygif?.url ||
      media?.mp4?.url ||
      media?.tinymp4?.url;

    if (!pickedUrl) {
      return res.status(502).json({ error: "Tenor response missing a usable media URL" });
    }

    const user = await User.findOne({ id: uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.gifs.push({ url: pickedUrl });
    await user.save();

    const savedGif = user.gifs[user.gifs.length - 1];

    return res.json({
      success: true,
      gif: savedGif,
      tenor: { next: data?.next ?? "" },
    });
  } catch (err) {
    const status = err?.status || 500;
    console.error("Error creating GIF:", err?.response?.data || err);
    return res.status(status).json({ error: "Server error while creating user GIF" });
  }
});

// GET /api/me/gifs -> list all user gifs (newest first)
router.get("/me/gifs", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const user = await User.findOne({ id: uid }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const gifs = [...(user.gifs || [])].sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    );
    return res.json({ success: true, gifs });
  } catch (err) {
    console.error("Error fetching GIFs:", err);
    return res.status(500).json({ error: "Server error while fetching user GIFs" });
  }
});


// POST /api/users/:uid/gifs
router.post("/users/:uid/gifs", verifyToken, ensureSelfParam("uid"), async (req, res, next) => {
  // Delegate to /me handler to avoid duplicate logic
  req.url = "/me/gifs";
  router.handle(req, res, next);
});

// GET /api/users/:uid/gifs
router.get("/users/:uid/gifs", verifyToken, ensureSelfParam("uid"), async (req, res, next) => {
  req.url = "/me/gifs";
  router.handle(req, res, next);
});

export default router;