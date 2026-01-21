import { useEffect, useRef, useState } from "react";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Handshake,
  PieChart,
  GitMerge,
  CreditCard,
  LifeBuoy,
  ArrowRight,
  CheckCircle,
  Building,
  Calendar,
  Download,
  Eye,
  Shield,
  Clock,
  Zap,
  Globe,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  MailOpen,
  PhoneCall,
} from "lucide-react";
import HeroSection from "./HeroSection";
import AISearchSection from "./AISearchSection";

const stats = [
  { number: 35, label: "Years Experience", suffix: "+" },
  { number: 150, label: "Max Revenue Focus", suffix: "M" },
  { number: 100, label: "Success Rate", suffix: "%" },
  { number: 500, label: "Deals Completed", suffix: "+" },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Vision",
    description:
      "We start by understanding your unique definition of freedom and assessing all options.",
    icon: Eye,
    duration: "2-3 weeks",
  },
  {
    step: "02",
    title: "Strategy Development",
    description:
      "Co-create a tailored plan that aligns with your business and personal goals.",
    icon: Target,
    duration: "3-4 weeks",
  },
  {
    step: "03",
    title: "Market Preparation",
    description:
      "Position your company and refine the narrative for maximum market appeal.",
    icon: Zap,
    duration: "4-6 weeks",
  },
  {
    step: "04",
    title: "Execution & Closing",
    description:
      "Implement the strategy with confidence, transparency, and commitment.",
    icon: CheckCircle,
    duration: "8-12 weeks",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Joe",
    location: "San Jose, CA",
    category: "From Customers",
    title: "Integrity, Consistency, Honesty",
    content:
      "We brought Dave and his team in after we'd engaged and paid an investment bank a bit over $1,000,000 with no success. Dave introduced 4 private equity firms with knowledge of our industry and worked with us through the entire process concluding with a $68,000,000 closed transaction.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jake",
    location: "Tennessee",
    category: "From Customers",
    title: "We were in big trouble",
    content:
      "COVID hit us hard and the hangover was even worse. After 80 years in business, we were looking into the abyss and only the abyss was looking back. Dave and his team came in and were only positive in every step. He recognized the underlying value of our company, convened all the stake holders and took us through a multi step process resulting in full payment to all of our vendors, maintenance of our well earned reputation, and most importantly, 289 employees where able to continue to provide for their families.",
    rating: 5,
  },
  {
    id: 3,
    name: "Jeremy",
    location: "Iowa",
    category: "From Customers",
    title: "The excavation business is hard",
    content:
      "The industry is fragmented and we often have challenges putting together the right partners with the right equipment with the right skill set to effectively bid a job we need to win. I was referred to Dave and he got on a plane from LA to Iowa to hear me out. He actually listened more than he talked. Soon thereafter he met with the fellow contractors who I most enjoyed working with and taught us a new word, SYNERGY. Dave put the deal together and we're on track to do four times the business each of us did before. Thanks Dave!!!",
    rating: 5,
  },
  {
    id: 4,
    name: "Geoff",
    location: "Westport, CT",
    category: "From Equity Partners",
    title: "No Surprises!!!",
    content:
      "When Dave brings us a deal it's well conceived, well researched, well founded and completely transparent with a well organized data room. We don't always say yes but it's mostly hard to say no.",
    rating: 5,
  },
  {
    id: 5,
    name: "Jill",
    location: "Chicago, IL",
    category: "From Private Debt Firms",
    title: "Transparency!!!",
    content:
      "Most deals we look at aren't bankable and we always need to keep a keen eye on whatever the borrower provides. Not with Dave. He leads with the challenges and makes sure we have a clear understanding of the warts along with a clear plan to smooth them out. It's always a please to work with you Dave.",
    rating: 5,
  },
];

// Dummy data for search responses
const dummyResponses = {
  "What does a typical Freedom M&A project cost or include?":
    "A typical Freedom M&A project for businesses with $50M–$150M in revenue includes a comprehensive four-step process: Discovery & Vision (2-3 weeks), Strategy Development (3-4 weeks), Market Preparation (4-6 weeks), and Execution & Closing (8-12 weeks). Services cover business valuation, strategic planning, market positioning, and deal execution, tailored to align with your financial and personal goals. Costs vary based on project complexity and business size, typically ranging from low six figures to mid-seven figures for full-service engagements. For precise pricing, contact Freedom M&A at https://x.ai/freedom-ma.",
  "How does Freedom M&A handle founder-owned business transitions?":
    "Freedom M&A specializes in founder-owned businesses, guiding you through a tailored process to ensure a seamless transition. We start with Discovery & Vision to understand your goals, followed by Strategy Development to create a plan that maximizes value. Market Preparation positions your business for appeal, and Execution & Closing ensures a smooth deal with transparency. Our 35+ years of experience and 100% success rate ensure your vision is realized.",
  "Why choose Freedom M&A for valuations, sales, and mergers?":
    "Freedom M&A offers over 35 years of experience, a 100% success rate, and 500+ completed deals, focusing on businesses with $50M–$150M in revenue. Our personalized approach, four-step process, and commitment to aligning with your definition of freedom make us the ideal partner for valuations, sales, and mergers.",
};

import SEO from "../common/SEO";

// ... existing imports ...

const Home = () => {
  const countRefs = useRef([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-transition testimonials
  // Auto-transition testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 2000); // Change testimonial every 6 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle IntersectionObserver for stats animation (unchanged)
  useEffect(() => {
    const observers = stats.map((stat, index) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const statElement = countRefs.current[index];
            if (statElement) {
              const target = stat.number;
              let start = 0;
              const duration = 2000;
              const increment = target / (duration / 16);

              const updateCount = (startTime) => {
                const elapsed = performance.now() - startTime;
                start = Math.min(target, (elapsed / duration) * target);
                statElement.textContent = Math.ceil(start).toString();
                if (start < target) {
                  requestAnimationFrame((time) => updateCount(startTime));
                }
              };

              requestAnimationFrame((time) => updateCount(time));
            }
            observers[index].disconnect();
          }
        },
        { threshold: 0.5 }
      );
    });

    stats.forEach((_, index) => {
      if (countRefs.current[index]?.parentElement) {
        observers[index].observe(countRefs.current[index].parentElement);
      }
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchResponse("");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Look up dummy response
      const response =
        dummyResponses[searchQuery.trim()] ||
        "Sorry, no response available for this query. Try one of the suggested questions or contact Freedom M&A for more details.";
      setSearchResponse(response);
    } catch (err) {
      setError("An error occurred while processing your query.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Dave Marshall | M&A Expert & Business Strategist" 
        description="With 35+ years of experience and 500+ successful deals, Dave Marshall guides founders of $50M–$150M businesses through seamless valuations, mergers, and sales."
        canonicalUrl="/"
      />
      <div id="hero">
        <HeroSection
          title="Define Your Path to Ultimate Freedom"
          subtitle="For over three decades, we've guided visionary founders through transitions, aligning their journey with personal and financial freedom."
          ctaPrimary="Start Your Journey"
          ctaSecondary="Learn Our Process"
          ctaPrimaryLink="#cta-section"
          ctaSecondaryLink="#services"
          backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        />
      </div>

      {/* AI Search Section */}
      <div id="ai-assistant">
        <AISearchSection />
      </div>
      {/* <section className="py-16 md:py-24 bg-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#be3144] mb-4">
              <span className="text-[#303841]">Explore Freedom M&A</span> Ai
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6">
              With 35+ years of experience and 500+ successful deals, Freedom
              M&A helps $50M–$150M founders achieve seamless valuations,
              mergers, and sales.
            </p>
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="e.g., 'How can Freedom M&A help me sell my company?'"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#be3144] text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#be3144] text-white p-2 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65 7.5 7.5 0 0116.65 16.65z"
                    ></path>
                  </svg>
                )}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            {searchResponse && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                <p className="text-gray-800 text-left">{searchResponse}</p>
              </div>
            )}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(dummyResponses).map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setSearchResponse(dummyResponses[suggestion]);
                    }}
                  >
                    <div className="text-[#be3144] mb-2">
                      <svg
                        className="w-6 h-6 inline"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-800">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <main className="min-h-screen bg-[#d3d6db]">
        {/* Summary Section */}
        <section id="commitment" className="py-16 md:py-24 bg-[#303841] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/20 rounded-full text-[#be3144] font-medium text-sm mb-6">
                <Target className="w-4 h-4 mr-2" aria-hidden="true" />
                Why Freedom M&A?
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Your Trusted Partner in{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950]">
                  Transformation
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
                Freedom Mergers & Acquisitions specializes in guiding founders
                of $50M–$150M businesses through high-stakes transitions. Led by
                Dave Marshall, our 35+ years of experience, success-based fees,
                and nationwide reach ensure your journey to freedom is personal,
                transparent, and results-driven.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#3a4750]/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Handshake
                    className="w-10 h-10 text-[#be3144] mb-4 mx-auto"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold mb-2">Our Services</h3>
                  <p className="text-sm text-white/80">
                    From expert valuations and enterprise sales to synergistic
                    mergers and turnaround strategies, we offer tailored
                    solutions to meet your unique needs.
                  </p>
                </div>
                <div className="bg-[#3a4750]/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Award
                    className="w-10 h-10 text-[#be3144] mb-4 mx-auto"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold mb-2">Our Commitment</h3>
                  <p className="text-sm text-white/80">
                    With a 100% success rate and over 500 deals completed, our
                    180-day exclusive contracts and client-centric approach
                    deliver transformational outcomes.
                  </p>
                </div>
              </div>
              <p className="text-sm italic text-white/80">
                “Freedom M&A turned my vision into reality with unmatched
                expertise.” — Emily S., Founder
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24 bg-[#d3d6db]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/10 rounded-full text-[#be3144] font-medium text-sm">
                    <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
                    About Freedom M&A
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#303841]">
                    A Legacy of Helping Founders Define Their{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
                      Freedom
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-[#3a4750] leading-relaxed">
                    For over three decades, Freedom M&A has been a beacon for
                    founders navigating complex transitions. Our approach is
                    rooted in understanding your vision, values, and family,
                    ensuring every step aligns with your personal definition of
                    freedom.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        icon: Users,
                        title: "Founder-Focused",
                        desc: "Exclusive focus on founder-owned businesses",
                      },
                      {
                        icon: Target,
                        title: "$50M–$150M",
                        desc: "Companies generating substantial revenue",
                      },
                      {
                        icon: Shield,
                        title: "Proven Results",
                        desc: "Three decades of successful transitions",
                      },
                      {
                        icon: Globe,
                        title: "National Reach",
                        desc: "Trusted advisors across the United States",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-xl hover:bg-[#3a4750]/10 transition-colors duration-300"
                        role="article"
                        aria-labelledby={`about-item-${index}`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <h3
                            id={`about-item-${index}`}
                            className="font-semibold text-[#303841]"
                          >
                            {item.title}
                          </h3>
                          <p className="text-[#3a4750] text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Company Heritage"
                    className="w-full h-80 sm:h-96 rounded-2xl object-cover shadow-md hover:scale-105 transition-transform duration-500"
                    style={{ transform: "translateZ(0)" }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#be3144]/30 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-[#3a4750]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/20 rounded-full text-[#be3144] font-medium text-sm">
                  <Target className="w-4 h-4 mr-2" aria-hidden="true" />
                  Our Comprehensive Services
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
                  Tailored Solutions for Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
                    Freedom
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto mt-4">
                  Our services are designed to empower founders of $50M–$150M
                  businesses, offering expert valuations, enterprise sales,
                  recapitalizations, mergers, debt restructuring, and turnaround
                  strategies.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group p-6 rounded-2xl bg-[#d3d6db]/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                    Our Mission & Approach
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Led by Dave Marshall, we prioritize your vision and values.
                    Our 180-day exclusive contracts and success-based fees
                    ensure transparency, while our focus on transformational
                    outcomes sets us apart.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Founder-focused for $50M–$150M businesses",
                      "Transformational, not transactional",
                      "Nationwide trusted advisors",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle
                          className="w-4 h-4 text-[#be3144] flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="group p-6 rounded-2xl bg-[#d3d6db]/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Handshake
                      className="w-6 h-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                    Our Services & Leadership
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Dave Marshall’s 35+ years of experience in equity placements
                    and IPOs drives our services, from confidential enterprise
                    sales to strategic turnarounds, ensuring your business is
                    positioned for success.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Expert valuations & strategic options",
                      "Confidential enterprise sales",
                      "Turnaround strategies for stability",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle
                          className="w-4 h-4 text-[#be3144] flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-16 md:py-24 bg-[#d3d6db]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/20 rounded-full text-[#be3144] font-medium text-sm">
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  Our Proven Process
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#303841] mt-4">
                  From Vision to{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
                    Freedom
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-[#3a4750] max-w-3xl mx-auto mt-4 leading-relaxed">
                  Our hands-on process is meticulously designed to align every
                  step with your unique goals, delivering clarity, confidence,
                  and transformative results from discovery to closing.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-[#3a4750]/10 hover:border-[#be3144]/50 transition-all duration-300 transform hover:-translate-y-1 fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                    role="article"
                    aria-labelledby={`step-title-${index}`}
                  >
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <step.icon
                          className="w-8 h-8 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#d3d6db] border-2 border-[#be3144] rounded-full flex items-center justify-center text-xs font-semibold text-[#be3144]">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 flex-grow">
                      <h3
                        id={`step-title-${index}`}
                        className="text-base sm:text-lg font-semibold text-[#303841]"
                      >
                        {step.title}
                      </h3>
                      <p className="text-[#3a4750] text-sm leading-relaxed">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-[#3a4750]/10 rounded-full text-xs text-[#3a4750]">
                        <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                        {step.duration}
                      </div>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div
                        className="hidden lg:block absolute top-32 -right-12 w-12 h-0.5 bg-gradient-to-r from-[#be3144] to-[#e63950] "
                        aria-hidden="true"
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dave Marshall Section */}
        <section className="py-16 md:py-24 bg-[#3a4750]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 lg:order-1">
                  <img
                    src="./dave.webp"
                    alt="Portrait of Dave Marshall"
                    className="w-full h-auto  rounded-2xl object-cover transition-transform duration-500"
                  />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/20 rounded-full text-[#be3144] font-medium text-sm">
                    <Award className="w-4 h-4 mr-2" aria-hidden="true" />
                    Meet Dave Marshall
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    Founder, Visionary & Builder of{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
                      Legacies
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                    Dave Marshall, a Cornell graduate with over 35 years of
                    experience, is the driving force behind Freedom M&A. His
                    expertise in equity placements and IPOs, combined with a
                    passion for empowering founders, ensures transformative
                    outcomes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        icon: Award,
                        text: "Multi-million dollar equity placements",
                      },
                      { icon: Building, text: "Venture-backed IPO advisory" },
                      {
                        icon: Users,
                        text: "Millions raised for charitable initiatives",
                      },
                      {
                        icon: CheckCircle,
                        text: "Decades of boardroom experience",
                      },
                    ].map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 bg-[#d3d6db]/20 rounded-lg shadow-sm"
                        role="article"
                        aria-labelledby={`achievement-${index}`}
                      >
                        <achievement.icon
                          className="w-4 h-4 text-[#be3144] flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span
                          id={`achievement-${index}`}
                          className="text-white/80 text-sm font-medium"
                        >
                          {achievement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-[#d3d6db]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/20 rounded-full text-[#be3144] font-medium text-sm">
                  <Target className="w-4 h-4 mr-2" aria-hidden="true" />
                  Our Track Record
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#303841] mt-4">
                  Proven Success in{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
                    Transforming Futures
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-[#3a4750] max-w-3xl mx-auto mt-4">
                  Our results speak for themselves, with a legacy of successful
                  transitions and satisfied clients across the nation.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-[#3a4750]/10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    ref={(el) =>
                      (countRefs.current[index] = el?.querySelector("span"))
                    }
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-[#be3144]">
                      <span aria-live="polite">{0}</span>
                      {stat.suffix}
                    </div>
                    <p className="text-sm text-[#3a4750] mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-[#303841]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[#be3144]/20 rounded-full text-white font-medium text-sm">
                  <Star className="w-4 h-4 mr-2" aria-hidden="true" />
                  Client Success Stories
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
                  What Our Clients Say About{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950]">
                    Freedom M&A
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto mt-4 leading-relaxed">
                  Real stories from founders, equity partners, and debt firms
                  who transformed their businesses with our guidance.
                </p>
              </div>

              {/* Carousel */}
              <div className="relative max-w-4xl mx-auto">
                {/* Testimonial Card */}
                <div className="bg-gradient-to-br from-[#3a4750] to-[#2a3138] rounded-2xl p-8 md:p-12 shadow-xl border border-[#be3144]/20 min-h-[400px] flex flex-col justify-between transition-all duration-700 ease-in-out opacity-100">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4 transition-all duration-700 ease-in-out">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-white text-[#be3144] transition-all duration-500"
                          aria-hidden="true"
                        />
                      )
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="inline-flex items-center px-3 py-1  rounded-full text-white text-xs font-semibold mb-4 w-fit bg-[#be3144]/30 transition-all duration-700 ease-in-out">
                    {testimonials[currentTestimonial].category}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 transition-all duration-700 ease-in-out">
                    "{testimonials[currentTestimonial].title}"
                  </h3>

                  {/* Content */}
                  <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 flex-grow transition-all duration-700 ease-in-out">
                    {testimonials[currentTestimonial].content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-6 border-t border-[#be3144]/20 transition-all duration-700 ease-in-out">
                    <div>
                      <p className="text-white font-semibold transition-all duration-700 ease-in-out">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-white text-sm transition-all duration-700 ease-in-out">
                        {testimonials[currentTestimonial].location}
                      </p>
                    </div>
                    <div className="text-[#be3144] opacity-20 transition-all duration-700 ease-in-out">
                      <svg
                        className="w-12 h-12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-6 0-6.002 4-6 7v11c0 1.6.957 4 6 4z"></path>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-6 0-6.002 4-6 7v11c0 1.6.957 4 6 4z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() =>
                      setCurrentTestimonial(
                        (prev) =>
                          (prev - 1 + testimonials.length) % testimonials.length
                      )
                    }
                    className="group p-2 md:p-3 rounded-full bg-[#be3144] hover:bg-[#e63950] text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft
                      className="w-5 h-5 md:w-6 md:h-6"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? "bg-[#be3144] w-8"
                            : "bg-white/30 w-2 hover:bg-white/50"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === currentTestimonial}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentTestimonial(
                        (prev) => (prev + 1) % testimonials.length
                      )
                    }
                    className="group p-2 md:p-3 rounded-full bg-[#be3144] hover:bg-[#e63950] text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight
                      className="w-5 h-5 md:w-6 md:h-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Testimonial Counter */}
                <div className="text-center mt-6 text-white/60 text-sm">
                  <span className="font-semibold text-[#be3144]">
                    {currentTestimonial + 1}
                  </span>
                  <span> / {testimonials.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta-section" className="py-16 md:py-24 bg-gradient-to-r from-[#be3144] to-[#e63950] relative">
          <div
            className="absolute inset-0 bg-black/10"
            aria-hidden="true"
          ></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Define Your <span>Freedom</span>?
              </h2>
              <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed">
                Join over 500 founders who have transformed their futures with
                Freedom M&A. Take the first step toward personal and financial
                freedom today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://calendly.com/dave-freedommergers/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex"
                >
                  <button
                    className="group inline-flex items-center justify-center
      bg-white text-[#303841] hover:bg-[#d3d6db]
      font-semibold text-base py-3 px-6 rounded-lg shadow-md
      transition-all duration-300 transform hover:scale-105"
                    aria-label="Schedule Consultation"
                  >
                    <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                    Schedule Consultation
                    <ArrowRight
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </a>

                <a
                  href="/contact"
                  className="group inline-flex items-center justify-center
    border-2 border-white text-white hover:bg-white hover:text-[#303841]
    font-semibold text-base py-3 px-6 rounded-lg
    transition-all duration-300 transform hover:scale-105"
                  aria-label="Contact Us"
                >
                  <PhoneCall className="w-4 h-4 mr-2" aria-hidden="true" />
                  Contact Us
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-white/80 text-sm">
                  180-day exclusive contracts • Success-based fee structure •
                  Complete transparency
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
