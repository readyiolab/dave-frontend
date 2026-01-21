import SEO from "../common/SEO";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";

const About = () => {
  return (
    <div>
      <SEO
        title="About Freedom M&A | Mission & Leadership"
        description="Learn about Freedom M&A's 35-year legacy of helping founders achieve financial freedom through expert mergers, acquisitions, and strategic planning."
        canonicalUrl="/about"
      />
      <div id="hero">
        <HeroSection
          title="About Freedom M&A"
          subtitle="For over three decades, Freedom Mergers & Acquisitions has been a trusted advisor to founders across the United States, specializing in complex, high-stakes transitions."
          ctaPrimary="Contact Us"
          ctaSecondary="Learn Our Services"
          ctaPrimaryLink="/contact"
          ctaSecondaryLink="/services"
        />
      </div>
      <AboutSection />
    </div>
  );
};

export default About;