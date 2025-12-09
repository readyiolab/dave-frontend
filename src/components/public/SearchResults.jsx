import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // Changed from 's' to 'q'
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query.replace(/\+/g, " ")); // Decode '+' to spaces for display
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Your siteContent array (unchanged)
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

  // Enhanced search function
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const searchTerms = query.split(' ').filter(term => term.length > 2);

      const results = siteContent
        .map(item => {
          let score = 0;
          let matchedTerms = [];

          searchTerms.forEach(term => {
            if (item.title.toLowerCase().includes(term)) {
              score += 10;
              matchedTerms.push(term);
            }
          });

          searchTerms.forEach(term => {
            if (item.description.toLowerCase().includes(term)) {
              score += 5;
              if (!matchedTerms.includes(term)) matchedTerms.push(term);
            }
          });

          searchTerms.forEach(term => {
            const contentMatches = (item.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
            score += contentMatches * 2;
            if (contentMatches > 0 && !matchedTerms.includes(term)) matchedTerms.push(term);
          });

          if (item.content.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)) {
            score += 15;
          }

          return {
            ...item,
            score,
            matchedTerms,
            relevance: matchedTerms.length / searchTerms.length
          };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ matchedTerms, score, relevance, ...item }) => item);

      setSearchResults(results);
      setIsLoading(false);
    }, 800);
  }, []);

  // Function to generate suggestions
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

  // Debounced search and suggestion functions
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      const cleanedQuery = cleanQuery(searchQuery);
      setSearchParams({ q: cleanedQuery }); // Use 'q' instead of 's'
      handleSearch(searchQuery);
    }, 300),
    [handleSearch, setSearchParams]
  );

  const debouncedGenerateSuggestions = useCallback(
    debounce((input) => generateSuggestions(input), 200),
    [generateSuggestions]
  );

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedGenerateSuggestions(value);
    debouncedSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const cleanedSuggestion = cleanQuery(suggestion);
    setSearchInput(suggestion); // Display original suggestion in input
    setSearchParams({ q: cleanedSuggestion });
    handleSearch(suggestion);
    setSuggestions([]);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanedQuery = cleanQuery(searchInput);
    setSearchParams({ q: cleanedQuery });
    handleSearch(searchInput);
    setSuggestions([]);
  };

  // Initial search based on URL query
  useEffect(() => {
    const decodedQuery = query.replace(/\+/g, " "); // Decode '+' to spaces for display
    setSearchInput(decodedQuery);
    handleSearch(decodedQuery);
  }, [query, handleSearch]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#d3d6db] via-[#3a4750] to-[#303841] py-10 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight tracking-tight">
              Search Results for: <span className="text-[#be3144]">{query.replace(/\+/g, " ") || "Your Query"}</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-[#d3d6db] max-w-3xl mx-auto">
              Explore our solutions, insights, and services tailored to your needs.
            </p>
          </div>

          {/* Search Input with Suggestions */}
          <div className="mb-6 sm:mb-8 max-w-3xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  placeholder="Search for services, team, or insights..."
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-black 
                             bg-white rounded-lg border  
                             focus:outline-none focus:ring-2 focus:ring-[#be3144] 
                             placeholder-black"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
              </div>
              <Button
                type="submit"
                className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium 
                 rounded-lg bg-[#be3144] hover:bg-[#a1283a] text-white transition-colors
                 h-full"
              >
                Search
              </Button>
            </form>
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-20 w-full max-w-3xl bg-white rounded-lg shadow-lg mt-2 border border-[#d3d6db]/20">
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
          </div>

          {/* Search Results */}
          <div className="bg-white backdrop-blur-md rounded-lg p-4 sm:p-6 md:p-8 shadow-xl">
            {isLoading && (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-[#be3144] mx-auto"></div>
                <p className="mt-4 text-base sm:text-lg text-black">
                  Searching...
                </p>
              </div>
            )}

            {!isLoading && searchResults.length > 0 && (
              <>
                <div className="mb-6 text-center">
                  <p className="text-sm sm:text-base text-gray-600">
                    Found <span className="font-semibold text-[#be3144]">{searchResults.length}</span> {searchResults.length === 1 ? 'result' : 'results'} for "{query.replace(/\+/g, " ")}"
                  </p>
                </div>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="group relative bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-[#d3d6db]/20 cursor-pointer transition-all duration-300 shadow-md hover:shadow-[#be3144]/25"
                      onClick={() => navigate(result.url)}
                    >
                      <div className="flex items-center gap-2 mb-3"></div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-black text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                        {result.description}
                      </p>
                      <p className="text-black text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                        {result.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigate(result.url)}
                          className="text-xs text-[#be3144] font-medium hover:underline"
                        >
                          Learn More
                        </button>
                        <ArrowRight className="w-4 h-4 text-[#be3144] group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#be3144] to-[#3a4750] rounded-lg opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!isLoading && query && searchResults.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-black mx-auto mb-4 opacity-60" />
                <p className="text-base sm:text-lg text-black mb-2">
                  No results found for "{query.replace(/\+/g, " ")}"
                </p>
                <p className="text-xs sm:text-sm text-black mb-6">
                  Try different keywords or browse our main sections.
                </p>
                <div className="text-left max-w-2xl mx-auto">
                  <h3 className="font-semibold text-black mb-3 text-center">Try searching for:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <p className="text-gray-600">• M&A services</p>
                      <p className="text-gray-600">• Business valuation</p>
                      <p className="text-gray-600">• Dave Marshall</p>
                      <p className="text-gray-600">• Enterprise sales</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">• Mergers and acquisitions</p>
                      <p className="text-gray-600">• Business transitions</p>
                      <p className="text-gray-600">• Contact information</p>
                      <p className="text-gray-600">• Freedom M&A</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!query && !isLoading && (
              <div className="text-center py-8 sm:py-12">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-black mx-auto mb-4 opacity-60" />
                <p className="text-base sm:text-lg text-black mb-4">
                  Please enter a search term to see results.
                </p>
                <div className="max-w-4xl mx-auto">
                  <h3 className="font-semibold text-black mb-6">Popular Searches:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      'M&A Services',
                      'Dave Marshall',
                      'Business Valuation',
                      'Enterprise Sales',
                      'Contact Info',
                      'Freedom M&A'
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          const cleanedTerm = cleanQuery(term);
                          setSearchInput(term);
                          setSearchParams({ q: cleanedTerm });
                          handleSearch(term);
                          setSuggestions([]);
                        }}
                        className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 group text-center"
                      >
                        <span className="text-sm font-medium text-gray-900 group-hover:text-[#be3144]">
                          {term}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
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

        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .group:hover {
            transform: scale(1.02);
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .group:hover {
            transform: scale(1.04);
          }
        }
      `}</style>
    </section>
  );
};

export default SearchResults;