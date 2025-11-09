import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import { User } from './models/User.js'

import { verifyToken } from './middleware/authentication.js'
import gifRoutes from './routes/gifRoutes.js'



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
  .then(() => console.log("MongoDB connected"))
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
