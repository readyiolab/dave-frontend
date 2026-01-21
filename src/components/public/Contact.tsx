import SEO from "../common/SEO";
import HeroSection from "./HeroSection";
import ContactSection from "./ContactSection";

const Contact = () => {
  return (
    <div>
      <SEO
        title="Contact Freedom M&A | Schedule a Consultation"
        description="Ready to redefine your future? Contact Freedom Mergers & Acquisitions for a confidential consultation with our expert team."
        canonicalUrl="/contact"
      />
      <HeroSection
        title="Contact Us Today"
        subtitle="Ready to define your freedom? Schedule a confidential consultation to explore your options with our experienced team."
        ctaPrimary="Start Your Journey"
        ctaSecondary="Learn About Us"
        ctaPrimaryLink="#contact-form"
        ctaSecondaryLink="#about"
      />
      <ContactSection />
    </div>
  );
};

export default Contact;