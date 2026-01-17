import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await api.post('/campaigns/subscribers', { email });
      setMessage({ type: 'success', text: '✓ Subscribed successfully!' });
      setEmail('');
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to subscribe. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Process", href: "/services" },
      { label: "Dave Marshall", href: "/dave" },
      { label: "Success Stories", href: "/blog" }
    ],
    services: [
      { label: "Expert Valuations", href: "/services" },
      { label: "Enterprise Sales", href: "/services" },
      { label: "Recapitalizations", href: "/services" },
      { label: "Debt Restructure", href: "/services" }
    ],
    resources: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Confidentiality", href: "#" }
    ]
  };

  return (
    <footer className="bg-[#303841] text-[#d3d6db]">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <img
              src="/lovable-uploads/a788d54f-9dd7-463b-8d6f-3d1ad45a6ade.webp"
              alt="Freedom M&A"
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-[#d3d6db]/80 leading-relaxed">
              For over three decades, helping founders define their path to freedom
              through thoughtful, transformational M&A guidance.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                onClick={(e) => handleLinkClick(e, 'https://linkedin.com')}
                className="w-10 h-10 bg-[#d3d6db]/10 rounded-full flex items-center justify-center hover:bg-[#be3144]/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-[#d3d6db]" />
              </a>
              <a
                href="https://twitter.com"
                onClick={(e) => handleLinkClick(e, 'https://twitter.com')}
                className="w-10 h-10 bg-[#d3d6db]/10 rounded-full flex items-center justify-center hover:bg-[#be3144]/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-[#d3d6db]" />
              </a>
            </div>
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#d3d6db]">Stay Informed</h4>
              <p className="text-[#d3d6db]/80 text-sm">Subscribe to our newsletter for M&A insights and updates.</p>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-[#d3d6db]/10 text-[#d3d6db] border border-[#d3d6db]/20 rounded-md focus:outline-none focus:border-[#be3144] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#be3144] text-[#d3d6db] rounded-md hover:bg-[#be3144]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '...' : 'Subscribe'}
                </button>
              </form>
              {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#d3d6db]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#d3d6db]/80 hover:text-[#be3144] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#d3d6db]">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#d3d6db]/80 hover:text-[#be3144] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#d3d6db]">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#d3d6db]/80 hover:text-[#be3144] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-[#d3d6db]/20">
          <a href="mailto:hello@freedomma.com" className="flex items-center gap-3 hover:text-[#be3144] transition-colors">
            <Mail className="w-5 h-5 text-[#be3144]" />
            <span className="text-[#d3d6db]/80">hello@freedomma.com</span>
          </a>
          <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-[#be3144] transition-colors">
            <Phone className="w-5 h-5 text-[#be3144]" />
            <span className="text-[#d3d6db]/80">+1 (555) 123-4567</span>
          </a>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#be3144]" />
            <span className="text-[#d3d6db]/80">Multiple US Locations</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-[#d3d6db]/20">
          <p className="text-[#d3d6db]/60 text-sm">
            © {currentYear} Freedom Mergers & Acquisitions. All rights reserved.
          </p>
          <p className="text-[#d3d6db]/60 text-sm mt-4 md:mt-0">
            Professional M&A Advisory Services | Confidential Consultations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;