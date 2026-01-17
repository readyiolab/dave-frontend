import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";

const About = () => {
  return (
    <div>
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