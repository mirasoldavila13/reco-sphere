/**
 * FeaturesSection Component
 *
 * This component highlights the key features of the RecoSphere platform in a visually appealing layout.
 *
 * Key Features:
 * - **Personalized Recommendations**: Content tailored to individual preferences using algorithms.
 * - **Advanced Filtering**: Tools to sort by genre, rating, and more.
 * - **Seamless Integration**: Leverages external APIs like TMDb, OMDb, and TasteDive for enriched data.
 *
 * Features:
 * - **Responsive Design**: Utilizes a grid layout that adapts to different screen sizes.
 * - **Dynamic Content**: Features are dynamically rendered from a pre-defined array.
 * - **Interactive Design**: Cards scale and highlight on hover for better user engagement.
 * - **TailwindCSS Styling**: Ensures consistency with the overall theme of the platform.
 */

const FeaturesSection = () => {
  // Define the key features to be displayed in the section
  const features = [
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
      description:
        "Enriched metadata powered by APIs like TMDb, OMDb, and TasteDive.",
      icon: "🔗", // Representational icon for the feature
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
