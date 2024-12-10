/**
 * HeroSection Component
 *
 * The `HeroSection` component serves as the introductory section of the application,
 * featuring a visually captivating background collage of trending movie and TV show posters,
 * fetched from the TMDb API. It aims to immediately engage users with a dynamic visual experience
 * while providing key action buttons to navigate to registration or learn more about the platform.
 *
 * Features:
 * - **Dynamic Collage Background**: Displays a grid of trending movie and TV show posters.
 *   - Posters are fetched dynamically from the TMDb API.
 *   - Fallback logic ensures no empty or broken images are displayed.
 * - **Responsive Design**: Fully responsive layout with appropriate scaling for different screen sizes.
 * - **Gradient Overlay**: Enhances text readability over the collage background.
 * - **Action-Oriented Content**:
 *   - "Get Started" button redirects users to the registration page.
 *   - "Learn More" button serves as a placeholder for additional informational content.
 *
 * State Management:
 * - `posterUrls`: Array of poster URLs fetched from the TMDb API.
 *
 * Lifecycle:
 * - Uses `useEffect` to fetch data from the TMDb API when the component mounts.
 *
 * Dependencies:
 * - React Router's `Link` component for navigation.
 * - Axios for API calls.
 * - TailwindCSS and DaisyUI for styling.
 */

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Define a type for media items
interface MediaItem {
  poster_path?: string;
}

const HeroSection = () => {
  const [posterUrls, setPosterUrls] = useState<string[]>([]);

  // Fetch posters for the collage
  const fetchPosters = async () => {
    try {
      // Fetch movie and TV data
      const movieResponse = await axios.get("/api/popular/movies");
      const tvResponse = await axios.get("/api/popular/tv");

      // Process poster URLs
      const posters = [
        ...movieResponse.data.results,
        ...tvResponse.data.results,
      ]
        .map(
          (item: MediaItem) =>
            item.poster_path &&
            `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        )
        .filter((url): url is string => Boolean(url))
        .slice(0, 12);

      setPosterUrls(posters);
    } catch (error) {
      console.error("Error fetching posters:", error);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  return (
    <header className="relative h-screen">
      {/* Collage Background */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1">
        {posterUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Poster ${index}`}
            className="w-full h-full object-cover"
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black opacity-90"></div>

      {/* Main Content */}
      <main className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white relative z-10">
        <section className="bg-black/60 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-white drop-shadow-md">
            Entertainment, Perfectly Tailored for You
          </h1>
          <p className="text-lg font-medium mb-8 text-gray-200 drop-shadow-md">
            Discover movies, shows, and recommendations customized to your
            taste.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="btn btn-primary btn-lg shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="#"
              className="btn btn-outline btn-lg btn-accent shadow-md hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>
    </header>
  );
};

export default HeroSection;
