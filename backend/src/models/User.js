import mongoose from "mongoose";

const gifSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, default: "" },
  dateAdded: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gifs: [gifSchema],
  following: [
    { type: mongoose.Schema.Types.String, ref: "User" }
  ]
});

export const User = mongoose.model("User", userSchema);  