import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content", // Reference to the Content model
    required: true,
  },
  reason: {
    type: String, // Explanation for the recommendation
    default: "Recommended based on your preferences.",
  },
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
