import HeroSection from "./HeroSection";
import DaveMarshallSection from "./DaveMarshallSection";

const DaveMarshall = () => {
  return (
    <div>
      <HeroSection
        title="Meet Dave Marshall"
        subtitle="Dave Marshall is the heartbeat behind Freedom M&A, guiding founders with over 35 years of experience in transformative transitions."
        ctaPrimary="Connect with Dave"
        ctaSecondary="Explore Our Services"
        ctaPrimaryLink="/contact"
        ctaSecondaryLink="/services"
      />
      <DaveMarshallSection />
    </div>
  );
};

export default DaveMarshall;