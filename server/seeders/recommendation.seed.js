import Recommendation from "../models/Recommendation.js";

export const seedRecommendations = async (users, content) => {
  await Recommendation.deleteMany({}); // Clear the Recommendations collection

  const recommendationsData = [
    {
      userId: users[2]._id, // John Doe
      contentId: content[0]._id, // First content item
      reason: "Based on your watch history.",
    },
    {
      userId: users[3]._id, // Jane Smith
      contentId: content[1]._id, // Second content item
      reason: "Highly rated in your favorite genres.",
    },
  ];

  const recommendations = await Recommendation.insertMany(recommendationsData);
  console.log(`Seeded ${recommendations.length} recommendations.`);
};
