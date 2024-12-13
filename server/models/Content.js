/**
 * Content Model
 *
 * This module defines the MongoDB schema and model for managing content items,
 * including movies, TV shows, and other media. It supports efficient storage,
 * retrieval, and updates of metadata-rich content records.
 *
 * Key Features:
 * - **Field Validation**:
 *   - Ensures critical fields like `title`, `slug`, and `genre` are mandatory.
 *   - Implements validation rules for `genre` to require at least one genre.
 * - **Metadata Handling**:
 *   - Allows flexible storage of additional information, such as external IDs,
 *     release dates, runtimes, and descriptions.
 * - **Robust Timestamps**:
 *   - Tracks creation and last modification dates using Mongoose's `timestamps` feature.
 * - **Efficient Querying**:
 *   - Uses MongoDB indexing to optimize lookups by `title` and `genre`.
 * - **Soft Deletion**:
 *   - Includes an `isDeleted` field to support soft-deletion patterns without
 *     permanently removing records.
 *
 * Schema Details:
 * - **Fields**:
 *   - `title` (String, required): The title of the content, with a max length of 200 characters.
 *   - `slug` (String, required, unique): A URL-friendly identifier for the content.
 *   - `genre` (Array of Strings, required): Categories such as "Action" or "Drama"; must include at least one.
 *   - `rating` (Number, optional): User or system-provided rating, from 0 to 10 (default: 0).
 *   - `metadata` (Object, optional): Additional descriptive fields:
 *     - `externalId` (String): Links to external systems (e.g., TMDB ID).
 *     - `releaseDate` (Date): Content release date.
 *     - `runtime` (Number): Duration in minutes.
 *     - `description` (String): Textual description or summary.
 *   - `isDeleted` (Boolean, default: false): Indicates soft-deleted records.
 * - **Indexing**:
 *   - Indexed by `title` and `genre` for improved performance when filtering or searching.
 * - **Timestamps**:
 *   - Automatically includes `createdAt` and `updatedAt` fields.
 *
 * Use Cases:
 * - Manage a catalog of media items for applications like streaming platforms or recommendation engines.
 * - Dynamically filter and retrieve content based on genre, rating, or metadata.
 * - Support soft-deletion workflows to retain historical data for audit purposes.
 *
 * Security and Best Practices:
 * - Use the `slug` field for constructing SEO-friendly URLs or unique content references.
 * - Leverage `isDeleted` for non-destructive delete operations, avoiding permanent data loss.
 * - Ensure proper input sanitation and validation at the service/controller level for user-provided data.
 *
 * Example Usage:
 * ```javascript
 * import Content from './models/Content.js';
 *
 * // Create a new content item
 * const newContent = new Content({
 *   title: "Inception",
 *   slug: "inception",
 *   genre: ["Sci-Fi", "Thriller"],
 *   rating: 8.8,
 *   metadata: {
 *     externalId: "tt1375666",
 *     releaseDate: "2010-07-16",
 *     runtime: 148,
 *     description: "A thief who steals corporate secrets...",
 *   },
 * });
 * await newContent.save();
 *
 * // Query content by genre
 * const sciFiMovies = await Content.find({ genre: "Sci-Fi", isDeleted: false });
 *
 * // Soft-delete content
 * await Content.findByIdAndUpdate(contentId, { isDeleted: true });
 * ```
 *
 * Technologies:
 * - **Mongoose**: Provides a schema-based solution to model application data.
 * - **MongoDB**: Offers scalable and flexible database storage for structured and semi-structured data.
 *
 * Future Enhancements:
 * - Add support for additional indexing fields, such as `releaseDate` or `rating`.
 * - Include dynamic tagging for enhanced search capabilities.
 * - Integrate with external APIs to fetch or sync metadata.
 */

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
        validator(value) {
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
  },
);

// Index for efficient lookups
contentSchema.index({ title: 1, genre: 1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
