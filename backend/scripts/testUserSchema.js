import mongoose from "mongoose";
import { User } from "../src/models/User.js";

await mongoose.connect("mongodb://localhost:27017/mydatabase");


const user = new User({
  id: "user_abc123",
  name: "Alice",
  email: "alice@example.com",
  following: ["user_bob42"],
  gifs: [{ url: "https://tenor.com/view/sleepy-tired-dead-gif-12840199" }]
});

await user.save();
console.log("User saved");

const result = await User.findOne({ id: "user_abc123" });
console.log(result);

await mongoose.disconnect();
