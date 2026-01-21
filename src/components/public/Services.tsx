import SEO from "../common/SEO";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";

const Services = () => {
  return (
    <div>
      <SEO
        title="Services | Freedom Mergers & Acquisitions"
        description="Comprehensive M&A services including business valuation, exit strategy, market positioning, and deal execution for founder-owned businesses."
        canonicalUrl="/services"
      />
      <HeroSection
        title="Our M&A Solutions"
        subtitle="We offer a full spectrum of merger and acquisition services, each tailored to your unique situation and definition of freedom."
        ctaPrimary="Start Your Journey"
        ctaSecondary="Meet Dave Marshall"
        ctaPrimaryLink="/contact"
        ctaSecondaryLink="/dave"
      />
      <ServicesSection />
    </div>
  );
};

export default Services;