import Content from "../models/Content.js";

export const seedContent = async () => {
  await Content.deleteMany({}); // Clear the Content collection

  const contentData = [
    {
      title: "Inception",
      slug: "inception",
      genre: ["Action", "Sci-Fi"],
      rating: 8.8,
      metadata: {
        externalId: "tt1375666",
        releaseDate: new Date("2010-07-16"),
        runtime: 148,
        description:
          "A thief who steals corporate secrets through dream-sharing technology.",
      },
    },
    {
      title: "Breaking Bad",
      slug: "breaking-bad",
      genre: ["Drama", "Crime"],
      rating: 9.5,
      metadata: {
        externalId: "tt0903747",
        releaseDate: new Date("2008-01-20"),
        runtime: null,
        description:
          "A high school chemistry teacher turned methamphetamine producer.",
      },
    },
  ];

  const contents = await Content.insertMany(contentData);
  console.log(`Seeded ${contents.length} content items.`);
  return contents;
};
