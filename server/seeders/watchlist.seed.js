import Watchlist from "../models/Watchlist.js";

export const seedWatchlist = async (users) => {
  await Watchlist.deleteMany({}); // Clear the Watchlist collection

  const watchlistData = [
    {
      userId: users[2]._id, // John Doe
      tmdbId: "680", // TMDb ID for "Pulp Fiction"
      mediaType: "movie",
    },
    {
      userId: users[3]._id, // Jane Smith
      tmdbId: "1396", // TMDb ID for "Breaking Bad"
      mediaType: "tv",
    },
  ];

  const watchlist = await Watchlist.insertMany(watchlistData);
  console.log(`Seeded ${watchlist.length} watchlist items.`);
};
