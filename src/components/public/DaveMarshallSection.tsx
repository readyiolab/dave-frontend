import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Heart, Award, Users, TrendingUp, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DaveMarshallSection = () => {
  const navigate = useNavigate();

  const handleConnectWithDave = () => {
    window.open('https://calendly.com/dave-freedommergers/30min', '_blank', 'noopener,noreferrer');
  };

  const handleScheduleConsultation = () => {
    window.open('https://calendly.com/dave-freedommergers/30min', '_blank', 'noopener,noreferrer');
  };

  const handleDownloadGuide = () => {
    alert('Guide download will be available soon. Please contact us for more information.');
  };
  const achievements = [
    {
      icon: GraduationCap,
      title: "Cornell University Graduate",
      description: "Former President of Cornell Alumni Association, with a legacy of leadership and excellence.",
    },
    {
      icon: Building2,
      title: "35+ Years Experience",
      description: "Led multi-million-dollar equity placements and venture-backed IPOs across diverse industries.",
    },
    {
      icon: Heart,
      title: "Impact Advocate",
      description: "Raised millions for financial and charitable initiatives, creating lasting positive change.",
    },
    {
      icon: Award,
      title: "Trusted Advisor",
      description: "Guided countless founders through transformative transitions with empathy and expertise.",
    },
  ];

  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => {
      if (badgeRef.current) {
        observer.unobserve(badgeRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const target = 35;
    const duration = 2000;
    const increment = target / (duration / 50);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < target) {
          return Math.min(prev + increment, target);
        }
        clearInterval(interval);
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [hasStarted]);

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#d3d6db]/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <div id="about" className="space-y-6 sm:space-y-8 lg:space-y-10 fade-in-up">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#be3144] to-[#e63950] text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-md transform hover:scale-105 transition-transform duration-300">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              Founder | Visionary | Builder of Legacies
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#303841]">
              About{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
                Dave Marshall
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#3a4750] leading-relaxed max-w-xl sm:max-w-2xl">
              Dave Marshall is the heart of Freedom Mergers & Acquisitions, dedicated to empowering founders to achieve their vision of freedom through strategic and empathetic guidance.
            </p>
            <div className="space-y-6 sm:space-y-8">
              <p className="text-sm sm:text-base lg:text-xl text-[#3a4750] leading-relaxed">
                With over 35 years of experience, Dave has earned a reputation as a trusted advisor, navigating complex equity placements and IPOs with precision and care.
              </p>
              <p className="text-sm sm:text-base lg:text-xl text-[#3a4750] leading-relaxed">
                His passion for impact extends beyond business, having raised millions for charitable causes and mentored leaders through transformative journeys.
              </p>
              <p className="text-sm sm:text-base lg:text-xl text-[#3a4750] leading-relaxed italic">
                “Dave’s guidance was a lighthouse in a storm—steady, clear, and deeply human.” — Michael R., CEO
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#be3144]/10 to-[#e63950]/10 border-l-4 border-[#be3144] p-6 sm:p-8 lg:p-10 rounded-r-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <blockquote className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#303841] italic mb-6 sm:mb-8">
                "Success is only real when it leads to freedom—not just financial, but freedom of time, purpose, and legacy."
              </blockquote>
              <cite className="text-[#3a4750] font-semibold text-base sm:text-lg lg:text-xl">
                — Dave Marshall, Founder
              </cite>
            </div>
            <Button
              onClick={handleConnectWithDave}
              variant="premium"
              size="lg"
              className="group bg-gradient-to-r from-[#be3144] to-[#e63950] text-white hover:bg-[#be3144] transition-colors duration-300 text-base sm:text-lg lg:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-md w-full sm:w-auto transform hover:scale-105"
              aria-label="Connect with Dave Marshall"
            >
              Connect with Dave
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

          <div className="space-y-6 sm:space-y-8 lg:space-y-10 fade-in-up stagger-1">
            <div className="relative">
              <img
                src="./dave.webp"
                alt="Dave Marshall - Founder of Freedom M&A"
                className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                style={{ transform: "translateZ(0)" }}
              />
              <div
                ref={badgeRef}
                className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 bg-gradient-to-r from-[#be3144] to-[#e63950] text-white rounded-3xl p-4 sm:p-6 lg:p-8  transition-transform duration-300"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold" aria-live="polite">
                  {Math.floor(count)}+
                </div>
                <div className="text-sm sm:text-base font-semibold">Years Building Legacies</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`bg-white p-6 sm:p-8 hover-lift fade-in-up stagger-${index + 2} border border-[#3a4750]/10 hover:border-[#be3144]/50 transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl`}
                  role="article"
                  aria-labelledby={`achievement-title-${index}`}
                >
                  <achievement.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#be3144] mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300" />
                  <h4 id={`achievement-title-${index}`} className="font-semibold text-[#303841] mb-2 sm:mb-3 text-base sm:text-lg">
                    {achievement.title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#3a4750] leading-relaxed">{achievement.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div id="philosophy" className="mt-12 sm:mt-16 lg:mt-24 bg-gradient-to-r from-[#be3144]/10 to-[#e63950]/10 rounded-3xl p-8 sm:p-12 lg:p-16 fade-in-up stagger-3 shadow-lg">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#303841] mb-6 sm:mb-8 lg:mb-10">
              Dave's Philosophy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12 lg:mb-16">
              {[
                {
                  icon: Heart,
                  title: "Guided, Not Rushed",
                  description: "Thoughtful, unhurried guidance tailored to your pace and priorities.",
                },
                {
                  icon: TrendingUp,
                  title: "Challenged, Not Sold",
                  description: "We challenge assumptions to align decisions with your long-term vision.",
                },
                {
                  icon: Award,
                  title: "Freedom on Your Terms",
                  description: "Your exit is a new beginning, crafted to reflect your unique aspirations.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col items-center space-y-4 sm:space-y-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                  role="article"
                  aria-labelledby={`philosophy-step-${index}`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 id={`philosophy-step-${index}`} className="text-xl sm:text-2xl font-semibold text-[#303841]">
                    {step.title}
                  </h4>
                  <p className="text-sm sm:text-lg text-[#3a4750] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <blockquote className="text-lg sm:text-xl lg:text-3xl font-semibold text-[#303841] italic bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-md transition-shadow duration-300">
              "This is the legacy Dave Marshall is building—one founder, one story, one freedom at a time."
            </blockquote>
            <p className="text-sm sm:text-base lg:text-lg text-[#3a4750] mt-6 sm:mt-8 leading-relaxed italic">
              “Over 80% of Dave’s clients return for additional guidance, a testament to his commitment.” — Trusted by founders nationwide
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
                Partner with Dave Marshall and Freedom M&A to transform your business journey into a path toward personal and financial freedom. Schedule a consultation or download our guide today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={handleScheduleConsultation}
                  className="group bg-white text-[#303841] hover:bg-[#d3d6db] font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                  aria-label="Schedule a consultation with Dave"
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

export default DaveMarshallSection;