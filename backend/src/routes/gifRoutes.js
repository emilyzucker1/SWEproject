import express from "express";
import axios from "axios";
import { User } from "../models/User.js";
import { verifyToken, ensureSelfParam } from "../middleware/authentication.js";

const router = express.Router();

// Shared search helpers
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

// Fallback provider: Giphy
async function searchGiphy(params) {
  const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
  const apiKey = process.env.GIPHY_API_KEY || "dc6zaTOxFJmzC"; // Public beta key fallback
  const { q, limit = 20, offset, rating = "pg" } = params;
  const { data } = await axios.get(GIPHY_SEARCH_URL, {
    params: {
      api_key: apiKey,
      q,
      limit,
      offset,
      rating,
      lang: "en",
    },
  });
  return data;
}

// POST /api/me/gifs  -> search Tenor, save first usable URL into user's gifs OR save direct URL
router.post("/me/gifs", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;

    const {
      q,
      url,  // Allow direct URL saving
      title, // Allow title to be passed
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

    // If URL is provided directly, save it
    if (url && typeof url === "string") {
      const user = await User.findOne({ id: uid });
      if (!user) return res.status(404).json({ error: "User not found" });

      console.log("=== SAVING GIF ===");
      console.log("URL:", url);
      console.log("Title received:", title);
      console.log("Title type:", typeof title);
      
      const gifToSave = { url, title: title || "" };
      console.log("Object to push:", gifToSave);
      
      user.gifs.push(gifToSave);
      await user.save();

      const savedGif = user.gifs[user.gifs.length - 1];
      console.log("Saved GIF from array:", savedGif);
      console.log("Saved GIF toObject:", savedGif.toObject());
      console.log("==================");
      
      return res.json({ success: true, gif: savedGif });
    }

    // Otherwise, search Tenor
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Missing required 'q' (search string) or 'url'" });
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

// GET /api/me/following/gifs -> get GIFs from users you follow (MUST be before /me/gifs)
router.get("/me/following/gifs", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Get current user to find who they follow
    const user = await User.findOne({ id: uid }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const followingIds = user.following || [];
    
    if (followingIds.length === 0) {
      return res.json({ success: true, items: [], hasMore: false });
    }

    // Get all users that current user follows
    const followedUsers = await User.find({ id: { $in: followingIds } }).lean();

    // Collect all GIFs from followed users with user info
    const allGifs = [];
    for (const followedUser of followedUsers) {
      const userGifs = followedUser.gifs || [];
      for (const gif of userGifs) {
        allGifs.push({
          url: gif.url,
          title: gif.title,
          dateAdded: gif.dateAdded,
          gifId: gif._id,
          userId: followedUser.id,
          userName: followedUser.name || followedUser.email?.split('@')[0] || 'Unknown'
        });
      }
    }

    // Sort by date (newest first)
    allGifs.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    // Paginate
    const startIdx = (pageNum - 1) * limitNum;
    const endIdx = startIdx + limitNum;
    const paginatedGifs = allGifs.slice(startIdx, endIdx);
    const hasMore = endIdx < allGifs.length;

    return res.json({ 
      success: true, 
      items: paginatedGifs,
      hasMore,
      total: allGifs.length
    });
  } catch (err) {
    console.error("Error fetching following GIFs:", err);
    return res.status(500).json({ error: "Server error while fetching following GIFs" });
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

// DELETE /api/me/gifs/:gifId -> delete a GIF from user's collection
router.delete("/me/gifs/:gifId", verifyToken, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const { gifId } = req.params;

    console.log("=== DELETE GIF REQUEST ===");
    console.log("User ID:", uid);
    console.log("GIF ID to delete:", gifId);

    const user = await User.findOne({ id: uid });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User has", user.gifs.length, "GIFs");
    console.log("GIF IDs in collection:", user.gifs.map(g => g._id.toString()));

    // Find and remove the GIF subdocument by _id using Mongoose helpers
    const subdoc = user.gifs.id(gifId);
    if (!subdoc) {
      console.log("GIF not found in subdocuments");
      return res.status(404).json({ error: "GIF not found" });
    }
    subdoc.deleteOne();
    await user.save();
    console.log("GIF deleted successfully via subdocument.deleteOne()");
    console.log("=========================");
    return res.json({ success: true, message: "GIF deleted successfully" });
  } catch (err) {
    console.error("Error deleting GIF:", err);
    return res.status(500).json({ error: "Server error while deleting GIF" });
  }
});

// GET /api/gifs/search -> search Tenor without saving (returns array of results)
router.get("/gifs/search", verifyToken, async (req, res) => {
  try {
    const {
      q,
      limit = 20,
      pos,
      random = false,
    } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Missing required 'q' (search query)" });
    }

    // Prefer Tenor if API key set; otherwise use Giphy fallback
    const hasTenor = !!process.env.TENOR_API_KEY;
    if (hasTenor) {
      const tenorParams = {
        q,
        client_key: process.env.TENOR_CLIENT_KEY,
        country: "US",
        locale: "en_US",
        contentfilter: "low",
        media_filter: "gif,tinygif",
        ar_range: "all",
        random: random === "true",
        limit: parseInt(limit, 10),
      };
      if (pos) tenorParams.pos = pos;

      const data = await searchTenor(tenorParams);
      const results = (data?.results || [])
        .map((result) => {
          const media = result.media_formats || {};
          return {
            id: result.id,
            url:
              media?.gif?.url ||
              media?.tinygif?.url ||
              media?.mp4?.url ||
              media?.tinymp4?.url,
            previewUrl: media?.tinygif?.url || media?.gif?.url,
            title: result.content_description || "",
          };
        })
        .filter((gif) => gif.url);

      return res.json({ success: true, gifs: results, next: data?.next || "" });
    } else {
      const giphyParams = {
        q,
        limit: parseInt(limit, 10),
        offset: 0,
        rating: "pg",
      };
      const data = await searchGiphy(giphyParams);
      const results = (data?.data || [])
        .map((item) => {
          const mp4 = item?.images?.downsized_medium?.mp4 || item?.images?.original_mp4?.mp4;
          const gifUrl = item?.images?.downsized?.url || item?.images?.original?.url;
          return {
            id: item.id,
            url: gifUrl || mp4,
            previewUrl: item?.images?.preview_gif?.url || gifUrl,
            title: item?.title || "",
          };
        })
        .filter((gif) => gif.url);

      return res.json({ success: true, gifs: results, next: "" });
    }
  } catch (err) {
    console.error("Error searching GIFs:", err?.response?.data || err);
    return res.status(500).json({ error: "Server error while searching GIFs" });
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