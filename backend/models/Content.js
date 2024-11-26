import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one genre must be specified.",
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    metadata: {
      externalId: { type: String, default: null },
      releaseDate: { type: Date, default: null },
      runtime: { type: Number, default: null },
      description: { type: String, default: "" },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt`
  }
);

// Index for efficient lookups
contentSchema.index({ title: 1, genre: 1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
