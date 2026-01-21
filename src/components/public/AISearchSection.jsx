import { useState, useEffect } from 'react';
import { api } from '../lib/api';

const AISearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Popular questions for quick search
  const popularQuestions = [
    "How can Freedom M&A help me sell my company?",
    "What is the valuation process?",
    "What are the costs involved?"
  ];

  // Typing effect
  useEffect(() => {
    if (searchResponse && searchResponse !== displayedResponse) {
      setIsTyping(true);
      setDisplayedResponse('');
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < searchResponse.length) {
          setDisplayedResponse(searchResponse.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 10); // Adjust speed here (lower = faster)

      return () => clearInterval(typingInterval);
    }
  }, [searchResponse]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setError('');
    
  };

  const preprocessResponse = (text) => {
    // If already has numbered sections with bold formatting, keep as is
    if (/\d+\.\s*\*\*[^*]+\*\*:/.test(text)) {
      return text;
    }
    
    // Try to detect and format key sections in the response
    // Look for sentences that could be section headers
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    if (sentences.length >= 3) {
      // Format as a clean response with proper structure
      return text;
    }
    
    return text;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSearchResponse('');
    setDisplayedResponse('');

    try {
      const response = await api.post('/ai-chat/search', { query: searchQuery });
      
      if (response.data && (response.data.response || response.data.message)) {
        const formattedResponse = preprocessResponse(response.data.response || response.data.message);
        setSearchResponse(formattedResponse);
      } else if (response.data && response.data.error) {
        setError(response.data.error);
      } else {
        setError('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('AI Search error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 
        'Failed to fetch response. For assistance, contact us at info@freedommergers.com or schedule a consultation at https://calendly.com/dave-freedommergers/30min.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedResponse = (text) => {
    const sections = text.split(/(\d+\.\s*\*\*[^*]+\*\*:)/);
    const formattedSections = [];
    const hasNumberedSections = /\d+\.\s*\*\*[^*]+\*\*:/.test(text);

    if (hasNumberedSections) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (/^\d+\.\s*\*\*[^*]+\*\*:$/.test(section)) {
          const headingText = section.replace(/^\d+\.\s*\*\*([^*]+)\*\*:$/, '$1');
          const number = section.match(/^(\d+)/)[1];
          formattedSections.push(
            <h3 key={`heading-${i}`} className="text-lg font-bold text-[#be3144] mt-6 mb-3 flex items-center">
              <span className="bg-[#be3144] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                {number}
              </span>
              {headingText}
            </h3>
          );
        } else if (section.trim() && i > 0) {
          formattedSections.push(
            <div key={`content-${i}`} className="text-gray-700 mb-4 pl-9">
              {formatContent(section.trim())}
            </div>
          );
        }
      }
    } else {
      // For plain text responses, format nicely with proper paragraph styling
      formattedSections.push(
        <div key="content" className="text-gray-700 leading-relaxed text-base space-y-3">
          {text.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-2">
              {formatContent(paragraph.trim())}
            </p>
          ))}
        </div>
      );
    }

    return <div className="text-left">{formattedSections}</div>;
  };

  const formatContent = (content) => {
  const email = "info@freedommergers.com";
  const calendly = "https://calendly.com/dave-freedommergers/30min";

  // Regex to extract both email and your specific Calendly link
  const linkRegex = new RegExp(`(${email}|${calendly})`, "g");

  return content.split(linkRegex).map((part, i) => {
    // Email clickable
    if (part === email) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="text-[#be3144] underline font-semibold hover:text-red-700 transition-colors"
        >
          {part}
        </a>
      );
    }

    // Calendly clickable
    if (part === calendly) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#be3144] underline font-semibold hover:text-red-700 transition-colors"
        >
          Schedule a Consultation
        </a>
      );
    }

    return part;
  });
};


  const renderResponse = (text) => {
    // Regex to match emails and various Calendly URLs (handles paths with dots, hyphens, etc.)
    const linkRegex = /(info@freedommergers\.com|https:\/\/calendly\.com\/[\w.\-\/]+)/g;
    
    return (
      <p className="text-gray-800 text-sm text-left">
        {text.split(linkRegex).map((part, i) => {
          if (part === "info@freedommergers.com") {
            return (
              <a
                key={i}
                href={`mailto:${part}`}
                className="text-[#be3144] underline font-semibold"
              >
                {part}
              </a>
            );
          }
          if (part && part.startsWith("https://calendly.com/dave-freedommergers/30min")) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#be3144] underline font-semibold"
              >
                Schedule a Consultation
              </a>
            );
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#be3144] mb-4">
            <span className="text-[#303841]">Explore Freedom M&A</span> AI
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            With 35+ years of experience and 500+ successful deals, Freedom M&A helps $50M–$150M founders achieve seamless valuations, mergers, and sales.
          </p>
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="e.g., 'How can Freedom M&A help me sell my company?'"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#be3144] text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search Freedom M&A services"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#be3144] text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              disabled={isLoading}
              aria-label={isLoading ? 'Searching...' : 'Submit search'}
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

          {error && (
            <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {renderResponse(error)}
              </div>
            </div>
          )}

          {displayedResponse && (
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              {renderFormattedResponse(displayedResponse)}
              {isTyping && (
                <span className="inline-block w-1 h-4 bg-[#be3144] ml-1 animate-pulse"></span>
              )}
              {!isTyping && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <p className="text-gray-700 font-medium">
                      Ready to take the next step?
                    </p>
                    <a
                      href="https://calendly.com/dave-freedommergers/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-[#be3144] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Schedule a Consultation
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Popular Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularQuestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-[#be3144] transition-all cursor-pointer group"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    // Trigger search with the selected question
                    setIsLoading(true);
                    setError('');
                    setSearchResponse('');
                    setDisplayedResponse('');
                    api.post('/ai-chat/search', { query: suggestion })
                      .then((response) => {
                        if (response.data && (response.data.response || response.data.message)) {
                          const formattedResponse = preprocessResponse(response.data.response || response.data.message);
                          setSearchResponse(formattedResponse);
                        } else if (response.data && response.data.error) {
                          setError(response.data.error);
                        }
                      })
                      .catch((err) => {
                        console.error('AI Search error:', err);
                        setError(err.response?.data?.error || 'Failed to fetch response.');
                      })
                      .finally(() => {
                        setIsLoading(false);
                      });
                  }}
                >
                  <div className="text-[#be3144] mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-800 font-medium text-sm group-hover:text-[#303841] transition-colors">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISearchSection;