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

