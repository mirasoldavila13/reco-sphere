/**
 * LandingPage Component
 *
 * This component serves as the main landing page for the RecoSphere platform, combining multiple
 * sub-sections to create a cohesive and user-friendly experience.
 *
 * Sections Included:
 * - **Navbar**: Persistent navigation bar across the platform.
 * - **HeroSection**: Eye-catching introduction with a dynamic collage and call-to-action buttons.
 * - **FeaturesSection**: Highlights the platform's key features and benefits.
 * - **TrendingSection**: Displays trending movies and TV shows using data from the TMDb API.
 * - **CTASection**: Encourages user sign-up with a compelling call-to-action.
 * - **Footer**: Provides links to additional resources and company information.
 *
 * Design Features:
 * - **Component-Based Architecture**: Encourages reusability and modularity.
 * - **Responsive Design**: Optimized for devices of all sizes.
 * - **Styling**: Consistent with the overall branding and theme using TailwindCSS and DaisyUI.
 */

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import TrendingSection from "../components/TrendingSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
