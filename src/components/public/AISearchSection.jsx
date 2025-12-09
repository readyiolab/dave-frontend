import { useState, useEffect } from 'react';

const AISearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Updated dummy responses with markdown-like formatting
  const dummyResponses = {
    "How can Freedom M&A help me sell my company?": `Freedom M&A provides comprehensive support for selling your company through the following services:\n\n1. **Business Valuation**: We analyze your company's financials, market position, and growth potential using industry-standard methods like DCF and comparables.\n2. **Due Diligence**: Our team ensures all documentation and processes meet buyer expectations, streamlining the sale process.\n3. **Strategic Buyer Outreach**: We identify and engage potential buyers to maximize your company's value.\n\nInterested in working with us? Schedule a Free Consultation Here: https://calendly.com/dave-freedommergers`,
    "What is the valuation process?": `Our valuation process is thorough and tailored to your business:\n\n1. **Financial Analysis**: We review your financial statements to assess revenue, profit, and cash flow trends.\n2. **Market Positioning**: We evaluate your industry standing and competitive advantages.\n3. **Valuation Methods**: We apply methods like Discounted Cash Flow (DCF) and comparable company analysis to determine fair value.\n\nInterested in working with us? Schedule a Free Consultation Here: https://calendly.com/dave-freedommergers`,
    "What are the costs involved?": `Costs are customized based on your needs:\n\n1. **Transparent Pricing**: We provide clear, upfront pricing tailored to the complexity of your transaction.\n2. **Flexible Services**: Costs vary depending on whether you need valuation, due diligence, or full M&A support.\n3. **No Hidden Fees**: We ensure all costs are discussed upfront to avoid surprises.\n\nInterested in working with us? Schedule a Free Consultation Here: https://calendly.com/dave-freedommergers`,
  };

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
    if (/\d+\.\s*\*\*[^*]+\*\*:/.test(text)) {
      return text;
    }
    return `1. **Overview**: ${text}`;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSearchResponse('');
    setDisplayedResponse('');

    try {
      // Simulating API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = dummyResponses[searchQuery] || 
        `Thank you for your question. For detailed information about "${searchQuery}", please contact us at info@freedommergers.com or schedule a consultation at https://calendly.com/dave-freedommergers`;
      
      const formattedResponse = preprocessResponse(response);
      setSearchResponse(formattedResponse);
      
      // Uncomment below for real API call
      /*
      const response = await api.post('/ai-chat/ai-search', { query: searchQuery });
      if (response.data.success) {
        const formattedResponse = preprocessResponse(response.data.message);
        setSearchResponse(formattedResponse);
      } else {
        const errorMessage = response.data.details
          ? response.data.details.join('. ') + '. For assistance, contact us at info@freedommergers.com or schedule a consultation at https://calendly.com/dave-freedommergers.'
          : response.data.message || response.data.error || 'Something went wrong. Please try again.';
        setError(errorMessage);
      }
      */
    } catch (err) {
      setError(
        'Failed to fetch response. For assistance, contact us at info@freedommergers.com or schedule a consultation at https://calendly.com/dave-freedommergers.'
      );
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
      formattedSections.push(
        <div key="content" className="text-gray-700">
          {formatContent(text)}
        </div>
      );
    }

    return <div className="text-left">{formattedSections}</div>;
  };

  const formatContent = (content) => {
    return content.split(/(info@freedommergers\.com|https:\/\/calendly\.com\/dave-freedommergers)/g).map((part, i) => {
      if (part === "info@freedommergers.com") {
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
      if (part === "https://calendly.com/dave-freedommergers") {
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
    return (
      <p className="text-gray-800 text-sm text-left">
        {text.split(/(info@freedommergers\.com|https:\/\/calendly\.com\/dave-freedommergers)/g).map((part, i) => {
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
          if (part === "https://calendly.com/dave-freedommergers") {
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
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Popular Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(dummyResponses).map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-[#be3144] transition-all cursor-pointer group"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSearchResponse(dummyResponses[suggestion]);
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