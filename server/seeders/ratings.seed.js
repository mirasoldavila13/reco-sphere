import Rating from "../models/Ratings.js";

export const seedRatings = async (users) => {
  await Rating.deleteMany({}); // Clear the Ratings collection

  const ratingsData = [
    {
      userId: users[2]._id, // John Doe
      tmdbId: "550",
      rating: 9.0, // Rating for "Fight Club"
    },
    {
      userId: users[3]._id, // Jane Smith
      tmdbId: "680",
      rating: 8.5, // Rating for "Pulp Fiction"
    },
  ];

  const ratings = await Rating.insertMany(ratingsData);
  console.log(`Seeded ${ratings.length} ratings.`);
};
