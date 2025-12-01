import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import { User } from './models/User.js'

import { verifyToken } from './middleware/authentication.js'
import gifRoutes from './routes/gifRoutes.js'
import promptRoutes from './routes/promptRoutes.js'
import admin from './firebaseAdmin.js'

async function syncFirebaseUsersToMongo() {
  console.log("Starting Firebase -> Mongo user sync...");
  let nextPageToken = undefined;
  let totalSynced = 0;

  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);

    const bulkOps = [];

    for (const userRecord of result.users) {
      const uid = userRecord.uid;
      const email = userRecord.email;

      // Your schema requires email and name
      if (!email) {
        console.warn(
          `Skipping user ${uid} because they have no email (email is required in schema).`
        );
        continue;
      }

      const name =
        userRecord.displayName ||
        (email ? email.split('@')[0] : 'Unnamed');

      bulkOps.push({
        updateOne: {
          filter: { id: uid },  // match your `id` field to Firebase UID
          update: {
            $setOnInsert: {
              gifs: [],
              following: []
            },
            $set: {
              id: uid,
              email,
              name
            }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length) {
      await User.bulkWrite(bulkOps);
      totalSynced += bulkOps.length;
    }

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  console.log(`Firebase -> Mongo user sync complete. Total users synced/updated: ${totalSynced}`);
}

dotenv.config()

console.log("Mongo URI:", process.env.MONGO_URI);

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json())
app.use("/api", gifRoutes);
app.use("/api", promptRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    try {
      await syncFirebaseUsersToMongo();  // ⬅️ Sync on startup
    } catch (err) {
      console.error("Error syncing Firebase users to Mongo:", err);
      // You can decide whether to `process.exit(1)` or continue:
      // process.exit(1);
    }

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));


app.get('/', (req, res) => {

  console.log("HI")
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/api/me', verifyToken, async (req, res) => {
  try {
    const authedUid = req.auth.uid;
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: "Missing 'name' or 'email'" });
    }

    const user = await User.findOneAndUpdate(
      { id: authedUid },                 // <- unchanged schema field
      { name, email },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).send("Server error while saving user");
  }
});

app.get("/api/users/me", verifyToken, async (req, res) => {
  try {
    const authedUid = req.auth.uid;
    const user = await User.findOne({ id: authedUid }).lean();

    if (!user) {
      return res.status(404).json({ error: "Current user not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching current user" });
  }
});

app.post('/api/users/:id/follow', verifyToken, async (req, res) => {
  try {
    const authedUid = req.auth.uid;     // current logged-in Firebase UID
    const targetId = req.params.id;     // user to follow (their `id` field)

    // 1. Prevent following yourself
    if (authedUid === targetId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }

    // 2. Make sure target user exists
    const targetUser = await User.findOne({ id: targetId });
    if (!targetUser) {
      return res.status(404).json({ error: "User to follow not found." });
    }

    // 3. Make sure current user exists
    const currentUser = await User.findOne({ id: authedUid });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    // 4. Add target to following list if not already there
    const alreadyFollowing = currentUser.following.includes(targetId);
    if (!alreadyFollowing) {
      currentUser.following.push(targetId);
      await currentUser.save();
    }

    // 5. Return updated current user (or just following list if you prefer)
    return res.json({
      success: true,
      message: alreadyFollowing
        ? "You are already following this user."
        : "Now following user.",
      user: currentUser
    });
  } catch (err) {
    console.error("Error following user:", err);
    return res.status(500).json({ error: "Server error while following user." });
  }
});

app.post('/api/users/:id/unfollow', verifyToken, async (req, res) => {
  try {
    const authedUid = req.auth.uid;
    const targetId = req.params.id;

    if (authedUid === targetId) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }

    const targetUser = await User.findOne({ id: targetId });
    if (!targetUser) {
      return res.status(404).json({ error: "User to unfollow not found." });
    }

    const currentUser = await User.findOne({ id: authedUid });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    const beforeCount = currentUser.following.length;
    currentUser.following = currentUser.following.filter(
      (id) => id !== targetId
    );
    const afterCount = currentUser.following.length;

    if (beforeCount !== afterCount) {
      await currentUser.save();
    }

    return res.json({
      success: true,
      message:
        beforeCount === afterCount
          ? "You were not following this user."
          : "User unfollowed.",
      user: currentUser
    });
  } catch (err) {
    console.error("Error unfollowing user:", err);
    return res.status(500).json({ error: "Server error while unfollowing user." });
  }
});

app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, { gifs: 0 }).lean(); // no gifs, lighter
    return res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching users" });
  }
});