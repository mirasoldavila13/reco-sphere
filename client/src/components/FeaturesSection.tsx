const FeaturesSection = () => {
  const features = [
    {
      title: "Personalized Recommendations",
      description:
        "Discover content tailored to your preferences using cutting-edge algorithms.",
      icon: "🎯",
    },
    {
      title: "Advanced Filtering",
      description:
        "Easily sort by genre, rating, and year to find what you’re looking for.",
      icon: "⚙️",
    },
    {
      title: "Seamless Integration",
      description:
        "Enriched metadata powered by APIs like TMDb, OMDb, and TasteDive.",
      icon: "🔗",
    },
  ];

  return (
    <section id="features" className="py-16 bg-neutral text-gray-200">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Why Choose <span className="text-primary">Reco</span>
          <span className="text-white">Sphere</span>?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,0,0,0.5)] hover:border-primary border border-gray-700 rounded-lg"
            >
              <div className="card-body text-center px-4 py-6">
                <div className="flex items-center justify-center text-5xl mb-4 text-primary">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="text-center text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
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
