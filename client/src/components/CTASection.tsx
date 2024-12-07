const CTASection = () => {
  return (
    <section
      id="cta"
      className="hero py-20 bg-gradient-to-r from-red-500 via-red-400 to-red-500"
    >
      <div className="hero-content text-center text-white">
        <div className="max-w-lg mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to <span className="text-accent">Discover</span>?
          </h2>
          <p className="text-lg mb-8 leading-relaxed">
            Sign up and unlock a world of personalized recommendations tailored
            just for you.
          </p>
          <button className="btn btn-accent btn-lg transition-transform transform hover:scale-110 hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
