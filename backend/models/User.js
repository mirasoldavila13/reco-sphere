import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    type: [String], // Array of genres or categories the user prefers
    default: [],
  },
  history: {
    type: [String], // Array of content IDs the user has interacted with
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
