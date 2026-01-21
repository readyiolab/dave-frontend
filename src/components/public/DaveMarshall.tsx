import SEO from "../common/SEO";
import HeroSection from "./HeroSection";
import DaveMarshallSection from "./DaveMarshallSection";

const DaveMarshall = () => {
  return (
    <div>
      <SEO
        title="Dave Marshall | Founder of Freedom Mergers & Acquisitions"
        description="Meet Dave Marshall, the visionary behind Freedom M&A. With 35+ years of experience in equity placements and IPOs, he empowers founders to achieve their financial freedom."
        canonicalUrl="/dave"
      />
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