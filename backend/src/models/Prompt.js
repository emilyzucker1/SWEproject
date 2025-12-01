import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  searchQuery: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
});

export const Prompt = mongoose.model("Prompt", promptSchema);
