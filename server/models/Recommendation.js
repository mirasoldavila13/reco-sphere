import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    reason: {
      type: String,
      default: "Recommended based on your preferences.",
      minlength: 10,
      maxlength: 500,
      trim: true,
    },
    status: {
      type: String,
      enum: ["viewed", "dismissed", "pending"],
      default: "pending",
    },
    context: {
      algorithm: {
        type: String,
        default: "collaborative-filtering",
      },
      score: {
        type: Number,
        default: null,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent duplicate recommendations for the same user and content
recommendationSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
