
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";

const BlogHeroSection = ({
  post = {
    title: "Blog Post Title",
    excerpt: "A brief excerpt of the blog post, summarizing the content in a concise and engaging way.",
  },
  ctaPrimary = "Read More",
  ctaSecondary = "Explore Posts",
  ctaPrimaryLink = "#",
  ctaSecondaryLink = "#"
}) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f1f3f6] via-[#e2e4e9] to-[#d3d6db]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-8 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-r from-[#e2e4e9] to-[#d3d6db] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
        <div className="absolute top-20 right-8 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-r from-[#d3d6db] to-[#be3144] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-r from-[#f1f3f6] to-[#be3144] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#d3d6db] opacity-60" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float animation-delay-1000">
          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-[#be3144] opacity-50" />
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-float animation-delay-2000">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#303841] opacity-40" />
        </div>
        <div className="absolute top-2/3 right-1/3 animate-float animation-delay-3000">
          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#3a4750] opacity-70" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="space-y-4 sm:space-y-6">
              {/* Blog Category or Tag Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#be3144]/10 text-[#be3144]">
                Blog Post
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#303841]">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-[#3a4750] leading-relaxed max-w-3xl mx-auto font-light">
                {post.excerpt}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a
                href={ctaPrimaryLink}
                className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-[#be3144] rounded-full text-white font-semibold text-base sm:text-lg shadow-md hover:shadow-[#be3144]/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-block text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {ctaPrimary}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#be3144] to-[#3a4750] rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </a>

              <a
                href={ctaSecondaryLink}
                className="group px-6 py-3 sm:px-8 sm:py-4 bg-white backdrop-blur-md border border-[#d3d6db]/30 rounded-full text-[#303841] font-semibold text-base sm:text-lg hover:bg-[#d3d6db]/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-block text-center"
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
          50% { transform: translateY(-10px) rotate(180deg); }
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
            line-height: 1.1;
          }
          p {
            line-height: 1.5;
          }
        }
      `}</style>
    </section>
  );
};

export default BlogHeroSection;
