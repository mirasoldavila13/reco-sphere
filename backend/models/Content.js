import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: [String], // Array of genres (e.g., ["Action", "Comedy"])
    required: true,
  },
  rating: {
    type: Number,
    default: 0, // Average rating from users
  },
  metadata: {
    type: Object, // Additional data from external APIs (e.g., TMDb, OMDb)
    default: {},
  },
});

const Content = mongoose.model("Content", contentSchema);

export default Content;
