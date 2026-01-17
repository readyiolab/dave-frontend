import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Site content for suggestions (same as in SearchResults)
   const siteContent = [
  {
    "id": 1,
    "title": "Home - Define Your Path to Ultimate Freedom",
    "description": "Guiding visionary founders through transformative transitions for over three decades.",
    "content": "Define your path to ultimate freedom. For over 30 years, Freedom M&A has guided visionary founders through transformative transitions, aligning personal and financial goals for a secure, confident, and successful future journey.",
    "url": "/",
    "type": "Section"
  },
  {
    "id": 2,
    "title": "Home - Explore Freedom M&A AI",
    "description": "Helping $75M–$150M founders achieve seamless valuations, mergers, and sales.",
    "content": "Explore Freedom M&A AI. With 35+ years and 500+ deals, we help $75M–$150M founders achieve seamless valuations, sales, and mergers, answering questions on selling, valuation, costs, and maximizing value effortlessly.",
    "url": "/",
    "type": "Section"
  },
  {
    "id": 3,
    "title": "Home - Why Freedom M&A?",
    "description": "Your trusted partner in transformation for $75M–$150M businesses.",
    "content": "Why Freedom M&A? Trusted partner for $75M–$150M founders in high-stakes transitions. Led by Dave Marshall, 35+ years’ experience, nationwide reach, transparent results-driven approach ensures freedom journey. Clients praise unmatched expertise.",
    "url": "/",
    "type": "Section"
  },
  {
    "id": 4,
    "title": "Home - Our Services Overview",
    "description": "Tailored solutions including valuations, enterprise sales, mergers, and turnarounds.",
    "content": "Our services include expert valuations, enterprise sales, mergers, and turnaround strategies. We deliver customized solutions tailored to unique business needs, ensuring growth, recovery, and maximum value creation through proven experience.",
    "url": "/",
    "type": "Section"
  },
  {
    "id": 5,
    "title": "Home - Our Commitment",
    "description": "100% success rate with over 500 deals completed.",
    "content": "Our commitment: 100% success rate, over 500 deals, 180-day exclusive contracts. A client-centric approach ensures transformational outcomes, transparency, and proven results in every partnership for lasting business success.",
    "url": "/",
    "type": "Section"
  },
  {
    "id": 6,
    "title": "About - Legacy of Freedom",
    "description": "Trusted partner to founders for over 30 years specializing in high-stakes transitions.",
    "content": "For 30+ years, Freedom M&A has been a trusted advisor to U.S. founders in high-stakes transitions, crafting bespoke strategies for independence, financial growth, and defining freedom with long-lasting impact.",
    "url": "/about",
    "type": "Section"
  },
  {
    "id": 7,
    "title": "About - Defining Your Freedom",
    "description": "Understanding your unique vision of freedom for a tailored transition.",
    "content": "Freedom is unique. Whether stepping away or staying engaged, our co-created roadmap prioritizes vision, family, and values. We empower founders to transition authentically, designing next chapters aligned with personal goals.",
    "url": "/about",
    "type": "Section"
  },
  {
    "id": 8,
    "title": "About - Our Approach",
    "description": "Mission-driven, transparent, and results-focused approach to transitions.",
    "content": "Our mission-driven approach aligns every transaction with personal freedom goals. Transparency and trust define our process, with empathy, care, and success-based fees ensuring maximum value and meaningful client outcomes.",
    "url": "/about",
    "type": "Section"
  },
  {
    "id": 9,
    "title": "About - Our Track Record",
    "description": "Over 500 successful transitions with 95% client satisfaction.",
    "content": "Our proven track record: 500+ successful transitions, 95% client satisfaction, exclusive 180-day contracts. We serve $75M–$150M businesses nationwide, delivering measurable results that build trust and long-term partnerships.",
    "url": "/about",
    "type": "Section"
  },
  {
    "id": 10,
    "title": "Services - Expert Valuations",
    "description": "Precise market valuations and strategic options tailored to your goals.",
    "content": "We deliver expert valuations, tailored strategies, detailed reports, and in-depth market analysis. From recapitalizations to debt refinancing, we align your goals with the best options for measurable success.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 11,
    "title": "Services - Majority Enterprise Sales",
    "description": "Confidential process to maximize your business’s value.",
    "content": "We manage enterprise sales with confidentiality, expertise, and precision. Our comprehensive exit strategies maximize value, ensuring smooth, discreet processes that protect founder interests and deliver rewarding outcomes.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 12,
    "title": "Services - Minority Recapitalizations",
    "description": "Access liquidity while retaining control and equity upside.",
    "content": "Minority recapitalizations provide liquidity while retaining control and equity upside. We align financial structures with your long-term vision, ensuring flexibility, operational influence, and sustainable business growth opportunities.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 13,
    "title": "Services - Synergistic Mergers",
    "description": "Forge partnerships with complementary businesses for mutual growth.",
    "content": "We create synergistic mergers by forging partnerships with complementary businesses. With strategic fit and win-win deal structures, we foster long-term collaboration, driving mutual growth, innovation, and measurable results.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 14,
    "title": "Services - Senior Debt Restructure",
    "description": "Optimize debt structure for financial flexibility and growth.",
    "content": "Our senior debt restructure solutions optimize financial structures, improving flexibility and enabling strategic growth. We deliver debt optimization strategies that reduce burdens and unlock sustainable opportunities for expansion.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 15,
    "title": "Services - Short-Term Finance Facilities",
    "description": "Secure urgent capital through bridge financing.",
    "content": "We provide short-term finance facilities, securing urgent capital through rapid bridge financing. These solutions ensure business continuity, enabling transformation, stability, and immediate access to funds when needed most.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 16,
    "title": "Services - Distressed & Turnaround",
    "description": "Stability and recovery plans for businesses facing challenges.",
    "content": "Our distressed and turnaround strategies provide stability, crisis management expertise, and recovery planning. We deliver clear paths to stabilization, ensuring businesses overcome challenges and regain strength for sustainable success.",
    "url": "/services",
    "type": "Service"
  },
  {
    "id": 17,
    "title": "Services - Our Process",
    "description": "Hands-on process from discovery to execution for transformative results.",
    "content": "Our process spans discovery, strategy, and execution. We co-create tailored plans, refine narratives, and execute with precision, ensuring confidence and clarity throughout the journey. Clients feel supported every step.",
    "url": "/services",
    "type": "Section"
  },
  {
    "id": 18,
    "title": "Dave Marshall - About",
    "description": "Dave Marshall, a trusted advisor with 35+ years of experience.",
    "content": "Meet Dave Marshall, the visionary behind Freedom M&A. With 35+ years’ experience, he guides founders through complex transitions, building legacies with empathy, precision, and unwavering commitment to authentic success.",
    "url": "/dave",
    "type": "Section"
  },
  {
    "id": 19,
    "title": "Dave Marshall - Philosophy",
    "description": "Guided, thoughtful approach to align with your vision of freedom.",
    "content": "Dave Marshall’s philosophy emphasizes guided, thoughtful, unhurried advice. He challenges assumptions, aligning decisions with founder visions. With 80% returning clients, his approach builds trust, legacy, and long-term partnerships nationwide.",
    "url": "/dave",
    "type": "Section"
  },
  {
    "id": 20,
    "title": "Contact Us - Get in Touch",
    "description": "Schedule a confidential consultation to explore your path to freedom.",
    "content": "Contact Freedom M&A for a confidential consultation. Our team helps define goals, create tailored plans, and ensure trusted outcomes. Email, call, or visit us to start your transformative journey today.",
    "url": "/contact",
    "type": "Section"
  }
];

  // Clean query for URL
  const cleanQuery = (input) => {
    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "+") // Replace spaces with '+'
      .replace(/&/g, "and") // Replace '&' with 'and'
      .replace(/[^a-z0-9+]/g, ""); // Remove special characters except '+' and alphanumeric
  };

  // Generate suggestions
  const generateSuggestions = useCallback((input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const query = input.toLowerCase().trim();
    const searchTerms = query.split(' ').filter(term => term.length > 2);

    const suggestionResults = siteContent
      .map(item => {
        let score = 0;
        let matchedTerms = [];

        searchTerms.forEach(term => {
          if (item.title.toLowerCase().includes(term)) {
            score += 10;
            matchedTerms.push(term);
          }
          if (item.description.toLowerCase().includes(term)) {
            score += 5;
            if (!matchedTerms.includes(term)) matchedTerms.push(term);
          }
          if (item.content.toLowerCase().includes(term)) {
            score += 2;
            if (!matchedTerms.includes(term)) matchedTerms.push(term);
          }
        });

        return {
          title: item.title,
          score,
          matchedTerms
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.title);

    setSuggestions(suggestionResults);
  }, []);

  // Debounced suggestions
  const debouncedGenerateSuggestions = useCallback(
    debounce((input) => generateSuggestions(input), 200),
    [generateSuggestions]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Dave Marshall", href: "/dave" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const cleanedQuery = cleanQuery(searchQuery);
      navigate(`/search?q=${cleanedQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cleanedSuggestion = cleanQuery(suggestion);
    setSearchQuery(suggestion);
    navigate(`/search?q=${cleanedSuggestion}`);
    setIsSearchOpen(false);
    setSuggestions([]);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white backdrop-blur-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" onClick={() => handleNavClick("/")}>
                <img
                  src="/lovable-uploads/a788d54f-9dd7-463b-8d6f-3d1ad45a6ade.webp"
                  alt="Freedom M&A"
                  className="h-10 sm:h-12 w-auto"
                />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `font-medium transition-colors hover:text-primary ${
                      isActive
                        ? "text-[#be3144]"
                        : isScrolled
                        ? "text-foreground"
                        : "text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={openSearch}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? "text-gray-600 hover:text-[#be3144] hover:bg-gray-100"
                    : "text-white hover:text-gray-300 hover:bg-white/10"
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Button
                className={`group transition-colors duration-300 ${
                  isScrolled
                    ? "bg-[#be3144] text-white hover:bg-[#a02738]"
                    : "bg-transparent text-white border border-white hover:bg-[#be3144] hover:text-white hover:border-[#be3144]"
                }`}
                onClick={() => handleNavClick("/contact")}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={openSearch}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? "text-gray-600 hover:text-[#be3144]"
                    : "text-white hover:text-gray-300"
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X
                    className={`w-6 h-6 ${
                      isScrolled ? "text-foreground" : "text-white"
                    }`}
                  />
                ) : (
                  <Menu
                    className={`w-6 h-6 ${
                      isScrolled ? "text-foreground" : "text-white"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="py-6 space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `block px-6 py-2 font-medium hover:text-[#be3144] transition-colors ${
                        isActive ? "text-[#be3144]" : "text-foreground"
                      }`
                    }
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="px-6 pt-4">
                  <Button
                    className="w-full group bg-[#be3144] text-white hover:bg-[#a02738] transition-colors duration-300"
                    onClick={() => handleNavClick("/contact")}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen flex items-start justify-center pt-16 sm:pt-24 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl">
              {/* Search Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Search Freedom M&A
                  </h2>
                  <button
                    onClick={closeSearch}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Find the solutions, insights, and services you need. Explore M&A expertise,
                  business consulting, and professional guidance.
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      debouncedGenerateSuggestions(e.target.value);
                    }}
                    placeholder="Type to start searching..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:border-transparent text-base"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors text-sm font-medium"
                  >
                    Search
                  </button>
                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white rounded-lg shadow-lg mt-2 border border-gray-200">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;