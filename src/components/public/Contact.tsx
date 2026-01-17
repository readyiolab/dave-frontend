import HeroSection from "./HeroSection";
import ContactSection from "./ContactSection";

const Contact = () => {
  return (
    <div>
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