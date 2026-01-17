import React from "react";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ 
  title = "Define Your Path to Ultimate Freedom",
  subtitle = "For over three decades, we've guided visionary founders through transformative transitions, helping business owners align their journey with personal and financial freedom.",
  ctaPrimary = "Start Your Journey",
  ctaSecondary = "Learn Our Process",
  ctaPrimaryLink = "#contact-form",
  ctaSecondaryLink = "#services"
}) => {
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    if (link.startsWith('#')) {
      // Handle anchor links with smooth scrolling
      const targetId = link.substring(1); // Remove the '#'
      const element = document.getElementById(targetId);
      if (element) {
        // Calculate offset to account for any fixed headers (adjust if needed)
        const offset = 80; // Adjust this value based on your header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (link.startsWith('/')) {
      // Handle route navigation
      navigate(link);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('http')) {
      // Handle external links
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#d3d6db] via-[#3a4750] to-[#303841]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-r from-[#d3d6db] to-[#3a4750] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-r from-[#3a4750] to-[#be3144] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-r from-[#303841] to-[#be3144] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-[#d3d6db] opacity-60" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float animation-delay-1000">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#be3144] opacity-50" />
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-float animation-delay-2000">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#303841] opacity-40" />
        </div>
        <div className="absolute top-2/3 right-1/3 animate-float animation-delay-3000">
          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#3a4750] opacity-70" />
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Content */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            <div className="space-y-6 sm:space-y-6 lg:space-y-8">
              {/* Premium Badge (Empty in original, keeping as placeholder) */}
              <div className="inline-flex items-center gap-2 px-2 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold"></div>

              {/* Main Heading */}
              <h1 className="text-6xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-semibold leading-tight tracking-tight">
                <span className="block text-white">
                  {title.split(' ').slice(0, Math.ceil(title.split(' ').length / 2)).join(' ')}
                </span>
                <span className="block mt-2 sm:mt-1 sm:mt-2 text-[#be3144]">
                  {title.split(' ').slice(Math.ceil(title.split(' ').length / 2)).join(' ')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#d3d6db] leading-relaxed max-w-3xl mx-auto font-light">
                {subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 lg:gap-6 justify-center items-center">
              <a 
                href={ctaPrimaryLink}
                onClick={(e) => handleLinkClick(e, ctaPrimaryLink)}
                className="group relative px-8 py-4 sm:px-8 sm:py-4 lg:px-10 lg:py-5 bg-[#be3144] rounded-full text-[#d3d6db] font-bold text-lg sm:text-base lg:text-xl shadow-xl hover:shadow-[#be3144]/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-block text-center cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 sm:gap-2 sm:gap-3">
                  {ctaPrimary}
                  <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#be3144] to-[#3a4750] rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </a>

              <a 
                href={ctaSecondaryLink}
                onClick={(e) => handleLinkClick(e, ctaSecondaryLink)}
                className="group px-8 py-4 sm:px-8 sm:py-4 lg:px-10 lg:py-5 bg-white backdrop-blur-md border border-[#d3d6db]/20 rounded-full text-black font-semibold text-lg sm:text-base lg:text-xl hover:bg-[#d3d6db]/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-block text-center cursor-pointer"
              >
                {ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Mobile-first responsive text sizing */
        @media (max-width: 640px) {
          h1 {
            line-height: 1.05;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;