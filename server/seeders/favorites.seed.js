import Favorite from "../models/Favorite.js";

export const seedFavorites = async (users) => {
  await Favorite.deleteMany({}); // Clear the Favorites collection

  const favoritesData = [
    {
      userId: users[2]._id, // John Doe
      tmdbId: "550", // TMDb ID for "Fight Club"
      mediaType: "movie",
    },
    {
      userId: users[3]._id, // Jane Smith
      tmdbId: "1402", // TMDb ID for "The Walking Dead"
      mediaType: "tv",
    },
  ];

  const favorites = await Favorite.insertMany(favoritesData);
  console.log(`Seeded ${favorites.length} favorites.`);
};
