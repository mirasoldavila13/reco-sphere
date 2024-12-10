import bcrypt from "bcrypt";
import User from "../models/User.js";

export const seedUsers = async () => {
  // Clear the User collection to prevent duplicates
  await User.deleteMany({});

  // Predefine users with raw passwords
  const usersData = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      preferences: ["Action", "Sci-Fi"],
      history: ["inception", "dark-knight"],
    },
    {
      name: "Regular User",
      email: "user@example.com",
      password: "user123",
      preferences: ["Drama", "Crime"],
      history: ["breaking-bad"],
    },
    {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      preferences: ["Comedy"],
      history: ["the-office"],
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "password123",
      preferences: ["Action", "Drama"],
      history: ["dark-knight", "breaking-bad"],
    },
  ];

  // Hash all passwords
  const usersWithHashedPasswords = await Promise.all(
    usersData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    }),
  );

  // Insert hashed users into the database
  const users = await User.insertMany(usersWithHashedPasswords);

  console.log(`Seeded ${users.length} users.`);
  return users;
};
