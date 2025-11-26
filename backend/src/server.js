import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import { User } from './models/User.js'

import { verifyToken } from './middleware/authentication.js'
import gifRoutes from './routes/gifRoutes.js'
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
