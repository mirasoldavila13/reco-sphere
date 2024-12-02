import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address format"], // Email regex validation
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Ensures the field exists
      minlength: [8, "Password must be at least 8 characters long"], // Minimum length
      validate: {
        validator(value) {
          return value.trim().length > 0; // Ensures it's not empty or just spaces
        },
        message: "Password cannot be empty or contain only spaces",
      },
    },
    preferences: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.every((pref) => typeof pref === "string");
        },
        message: "Preferences must be an array of strings",
      },
    },
    history: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.every((id) => typeof id === "string");
        },
        message: "History must be an array of valid IDs",
      },
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt timestamps
);

const User = mongoose.model("User", userSchema);

export default User;
