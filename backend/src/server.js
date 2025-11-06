import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import { User } from './models/User.js'

import { verifyToken } from './middleware/authentication.js'



dotenv.config()

console.log("Mongo URI:", process.env.MONGO_URI);

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you need cookies or authentication headers
}));

app.use(bodyParser.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get('/', (req, res) => {

  console.log("HI")
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post("/api/users", verifyToken, async (req, res) => {
  const { name, email, firebaseUid } = req.body;

  if (!name || !email || !firebaseUid) {
    return res.status(400).send("Missing user data");
  }

  try {
    console.log("Saving user:", { name, email, firebaseUid });

    const user = await User.findOneAndUpdate(
      { id: firebaseUid },
      { name, email },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).send("Server error while saving user");
  }
});

// Secured endpoint to fetch a user by Firebase UID.
// Only the authenticated user with the same UID may fetch their own record.
app.get("/api/users/:id", verifyToken, async (req, res) => {
  const requestedId = req.params.id;
  const authUid = req.user?.uid;

  if (!authUid) {
    return res.status(403).send("Unauthorized");
  }

  // Basic authorization: only allow users to fetch their own record.
  if (authUid !== requestedId) {
    return res.status(403).send("Forbidden: cannot access other user's data");
  }

  try {
    const user = await User.findOne({ id: requestedId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Server error while fetching user");
  }
});