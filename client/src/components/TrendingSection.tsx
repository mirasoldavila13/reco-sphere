import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingItem, TrendingResponse, GenreResponse } from "../types";
import fallbackImage from "../assets/images/fallback-image.jpg";

// Define Genre Map Interfaces
interface GenreMap {
  [key: number]: string;
}

const TrendingSection = () => {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [movieGenres, setMovieGenres] = useState<GenreMap>({});
  const [tvGenres, setTVGenres] = useState<GenreMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    try {
      const response = await axios.get<TrendingResponse>(`/api/trending`);
      setTrendingItems(response.data.results);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to fetch trending items: ${err.response.statusText}`);
      } else {
        setError("Failed to fetch trending items.");
      }
      console.error("Error fetching trending items:", err);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get<GenreResponse>(`/api/genres`);
      const { movieGenres, tvGenres } = response.data;

      const movieGenreMap: GenreMap = {};
      movieGenres.forEach((genre) => {
        movieGenreMap[genre.id] = genre.name;
      });
      setMovieGenres(movieGenreMap);

      const tvGenreMap: GenreMap = {};
      tvGenres.forEach((genre) => {
        tvGenreMap[genre.id] = genre.name;
      });
      setTVGenres(tvGenreMap);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to fetch genres: ${err.response.statusText}`);
      } else {
        setError("Failed to fetch genres.");
      }
      console.error("Error fetching genres:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTrending();
      await fetchGenres();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="trending" className="py-16 bg-neutral text-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Trending Now
          </h2>
          <div className="flex justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="trending" className="py-16 bg-neutral text-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Trending Now
          </h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="trending" className="py-16 bg-neutral text-gray-200">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Trending Movies & Shows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {trendingItems.map((item) => {
            let currentGenreMap: GenreMap = {};

            if (item.media_type === "movie") {
              currentGenreMap = movieGenres;
            } else if (item.media_type === "tv") {
              currentGenreMap = tvGenres;
            }

            return (
              <article
                key={item.id}
                className="card bg-base-100 shadow-lg relative overflow-hidden hover:shadow-2xl transition duration-300 transform hover:scale-105 hover:border hover:border-primary rounded-lg"
              >
                <figure className="relative h-72">
                  <img
                    loading="lazy"
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : fallbackImage
                    }
                    alt={`${item.title || item.name} Poster`}
                    className="w-full h-full object-cover rounded-t-lg transition duration-300 hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition duration-300"></div>
                </figure>
                <div className="card-body text-center p-4">
                  <h3 className="text-lg font-bold text-white">
                    {item.title || item.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.genre_ids && item.genre_ids.length > 0 ? (
                      <>
                        Genre:{" "}
                        {item.genre_ids
                          .map((id) => currentGenreMap[id] || "Unknown")
                          .join(", ")}
                      </>
                    ) : (
                      "Genre: N/A"
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
