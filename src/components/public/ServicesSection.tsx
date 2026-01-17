import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Handshake,
  PieChart,
  GitMerge,
  CreditCard,
  DollarSign,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesSection = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open('https://calendly.com/dave-freedommergers/30min', '_blank', 'noopener,noreferrer');
  };

  const handleDownloadGuide = () => {
    alert('Guide download will be available soon. Please contact us for more information.');
  };

  const handleLearnMore = (service: string) => {
    navigate('/services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const services = [
    {
      id: "expert-valuations",
      icon: TrendingUp,
      title: "Expert Valuations",
      description:
        "We deliver precise market valuations, offering strategic options like full sales, recapitalizations, or debt refinancing tailored to your goals.",
      features: ["In-Depth Market Analysis", "Custom Strategic Options", "Detailed Valuation Reports"],
    },
    {
      id: "majority-enterprise-sales",
      icon: Handshake,
      title: "Majority Enterprise Sales",
      description:
        "For founders ready to exit, we manage the process with confidentiality and expertise to maximize your business’s value.",
      features: ["Comprehensive Exit Strategy", "Confidential Deal Process", "Value Maximization"],
    },
    {
      id: "minority-recapitalizations",
      icon: PieChart,
      title: "Minority Recapitalizations",
      description:
        "Access liquidity while retaining control or equity upside, designed to align with your long-term vision.",
      features: ["Flexible Liquidity Access", "Retained Operational Control", "Equity Upside Potential"],
    },
    {
      id: "synergistic-mergers",
      icon: GitMerge,
      title: "Synergistic Mergers",
      description:
        "We forge partnerships with complementary businesses, creating win-win deals for mutual growth and success.",
      features: ["Strategic Partnership Building", "Complementary Business Fit", "Win-Win Deal Structures"],
    },
    {
      id: "senior-debt-restructure",
      icon: CreditCard,
      title: "Senior Debt Restructure",
      description:
        "Optimize your debt structure to enhance financial flexibility and fuel strategic growth initiatives.",
      features: ["Optimized Debt Solutions", "Enhanced Financial Flexibility", "Strategic Growth Support"],
    },
    {
      id: "short-term-finance-facilities",
      icon: DollarSign,
      title: "Short-Term Finance Facilities",
      description:
        "Secure urgent capital through bridge financing to ensure continuity and drive transformation.",
      features: ["Rapid Bridge Financing", "Immediate Capital Access", "Business Continuity Support"],
    },
    {
      id: "distressed-and-turnaround",
      icon: LifeBuoy,
      title: "Distressed & Turnaround",
      description:
        "We provide stability and strategic recovery plans for businesses facing challenges, paving a clear path forward.",
      features: ["Crisis Management Expertise", "Strategic Recovery Planning", "Business Stabilization"],
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Discovery",
      description: "We dive deep to understand your vision, goals, and options for achieving freedom.",
    },
    {
      step: "2",
      title: "Strategy",
      description: "We co-create a tailored plan that aligns with your personal and business objectives.",
    },
    {
      step: "3",
      title: "Execution",
      description: "We execute with precision, ensuring clarity, confidence, and commitment throughout.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#d3d6db] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20 fade-in-up" role="region" aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#303841] mb-4 sm:mb-6 lg:mb-8">
            Comprehensive M&A{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
              Solutions
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#3a4750] leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Our tailored merger and acquisition services empower founders with solutions that align with their vision of freedom, guiding you from valuation to execution with expertise and care.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16 lg:mb-20">
          {services.map((service, index) => (
            <Card
              key={index}
              id={service.id}
              className={`p-6 sm:p-8 lg:p-10 hover-lift group flex flex-col h-full bg-white border border-[#3a4750]/10 hover:border-[#be3144]/50 transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl fade-in-up stagger-${index % 4 + 1}`}
              role="article"
              aria-labelledby={`service-title-${index}`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 id={`service-title-${index}`} className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#303841] mb-4 sm:mb-6">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-[#3a4750] mb-6 sm:mb-8 leading-relaxed flex-grow">
                {service.description}
              </p>
              <div className="space-y-2 sm:space-y-3">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-[#3a4750]"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#be3144] rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>

            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#be3144]/10 to-[#e63950]/10 rounded-3xl p-8 sm:p-12 lg:p-20 fade-in-up stagger-3 shadow-lg">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#303841] mb-6 sm:mb-8 lg:mb-10">
              Our Process
            </h3>
            <p className="text-base sm:text-lg lg:text-2xl text-[#3a4750] mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
              Our hands-on process ensures your business is positioned for success. From discovery to execution, we refine your narrative, enhance your company’s appeal, and execute with precision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16 lg:mb-20 relative">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 flex flex-col items-center space-y-6 sm:space-y-8 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                  role="article"
                  aria-labelledby={`process-step-${index}`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-3xl group-hover:scale-105 transition-transform duration-300">
                    {step.step}
                  </div>
                  <h4 id={`process-step-${index}`} className="font-semibold text-[#303841] text-xl sm:text-2xl">
                    {step.title}
                  </h4>
                  <p className="text-sm sm:text-lg text-[#3a4750] leading-relaxed">
                    {step.description}
                  </p>

                </div>
              ))}
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-[#3a4750] leading-relaxed italic">
              “Their process made me feel in control and confident at every step.” — James P., Business Owner
            </p>
          </div>
        </div>

        <section className="mt-12 sm:mt-16 lg:mt-20 py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-3xl fade-in-up stagger-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Define Your Freedom?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed">
                Partner with Freedom M&A to transform your business journey into a path toward personal and financial freedom. Schedule a consultation or download our guide today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={handleScheduleConsultation}
                  className="group bg-white text-[#303841] hover:bg-[#d3d6db] font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                  aria-label="Schedule a consultation"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={handleDownloadGuide}
                  variant="outline"
                  className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#303841] font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                  aria-label="Download our guide"
                >
                  Download Our Guide
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ServicesSection;