/**
 * FeaturesSection Component
 *
 * This component highlights the key features of the RecoSphere platform, focusing on its
 * unique capabilities and user benefits. It is designed to be visually appealing and highly
 * responsive, ensuring an engaging experience for users across different devices.
 *
 * Features:
 * - **Dynamic Rendering**:
 *   - Utilizes a predefined array of feature data to dynamically render the feature cards.
 *   - Ensures scalability as new features can be added without modifying the layout.
 * - **Grid Layout**:
 *   - Implements a responsive grid that adapts to various screen sizes.
 *   - Displays one column on small screens, two columns on medium screens, and three columns on large screens.
 * - **Hover Effects**:
 *   - Includes scaling and shadow transitions for interactive feedback.
 * - **Thematic Design**:
 *   - Matches the application's color scheme with the use of TailwindCSS utility classes.
 *
 * Design Considerations:
 * - **Responsive Design**:
 *   - Optimized for mobile, tablet, and desktop views using TailwindCSS's grid system.
 * - **User Engagement**:
 *   - Incorporates hover animations to draw attention to each feature.
 *   - Uses icons to represent features visually, enhancing comprehension.
 * - **Scalability**:
 *   - New features can be easily added to the `features` array without altering the layout or code structure.
 *
 * Dependencies:
 * - TailwindCSS: For styling and responsiveness.
 * - Icons: Representational emojis for simplicity and better visual communication.
 *
 * Props:
 * - None (currently self-contained with a hardcoded list of features).
 */

const FeaturesSection = () => {
  // Define the key features to be displayed in the section
  const features = [
    {
      title: "Trending Movies & Shows",
      description:
        "Stay updated with the latest and most popular content, curated for your interests.",
      icon: "🔥", // Representational icon for the feature
    },
    {
      title: "Cross-Platform Sync",
      description:
        "Access your favorites, watchlists, and preferences seamlessly across all your devices.",
      icon: "🔄", // Representational icon for the feature
    },
    {
      title: "Personalized Recommendations",
      description:
        "Discover content tailored to your preferences using cutting-edge algorithms.",
      icon: "🎯", // Representational icon for the feature
    },
    {
      title: "Advanced Filtering",
      description:
        "Easily sort by genre, rating, and year to find what you’re looking for.",
      icon: "⚙️", // Representational icon for the feature
    },
    {
      title: "Seamless Integration",
      description: "Enriched metadata powered by TMDb API.",
      icon: "🔗", // Representational icon for the feature
    },
    {
      title: "Exclusive Features for Logged-in Users",
      description:
        "Logged-in users can add content to their favorites and enjoy a personalized experience.",
      icon: "🔒", // Representational icon for the feature
    },
  ];

  return (
    // Section container with padding and background styling
    <section id="features" className="py-16 bg-neutral text-gray-200">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Why Choose <span className="text-primary">Reco</span>
          <span className="text-white">Sphere</span>?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map through features array to dynamically render feature cards */}
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,0,0,0.5)] hover:border-primary border border-gray-700 rounded-lg"
            >
              <div className="card-body text-center px-4 py-6">
                {/* Icon Section */}
                <div className="flex items-center justify-center text-5xl mb-4 text-primary">
                  <span>{feature.icon}</span>
                </div>

                {/* Feature Title */}
                <h3 className="text-center text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
