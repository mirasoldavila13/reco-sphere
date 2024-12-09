import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import winston from "winston";

const router = express.Router();

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

/**
 * @route POST /api/register
 * @desc Register a new user
 * @access Public
 */
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await user.save();

    logger.info(`User registered: ${email}`);
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

export default router;
