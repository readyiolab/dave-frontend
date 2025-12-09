import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Heart, Shield, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We align every transaction with your personal vision of freedom, ensuring your goals shape our strategy.",
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "Transparency and accountability define our engagements, fostering trust through honest collaboration.",
    },
    {
      icon: Heart,
      title: "Personal Touch",
      description: "Transitions are personal. We tailor our approach to your unique needs with empathy and care.",
    },
    {
      icon: CheckCircle,
      title: "Results Focused",
      description: "Our success-based fees align our incentives with your outcomes, maximizing your value.",
    },
  ];

  const countRefs = useRef([]);
  const stats = [
    { number: 75, label: "Annual Revenue Range", suffix: "M - $150M" },
    { number: 180, label: "Exclusive Contract Terms", suffix: " Days" },
    { number: 500, label: "Successful Transitions", suffix: "+" },
  ];

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

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#d3d6db] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20 fade-in-up" role="region" aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#303841] mb-4 sm:mb-6 lg:mb-8">
            A Legacy of Helping Founders Define Their{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950] ">
              Freedom
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#3a4750] leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            For over three decades, Freedom Mergers & Acquisitions has been a trusted partner to founders nationwide, specializing in high-stakes transitions. We craft bespoke strategies to empower you toward financial independence, a new chapter, or a lasting legacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center mb-12 sm:mb-16 lg:mb-24">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 fade-in-up">
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#303841]">
                How Do You Define Freedom?
              </h3>
              <p className="text-sm sm:text-base lg:text-xl text-[#3a4750] leading-relaxed">
                Freedom is unique to each founder. It might mean stepping away from your business with confidence in its future or staying engaged on your own terms. At Freedom M&A, we begin with deep listening to understand your aspirations.
              </p>
              <p className="text-sm sm:text-base lg:text-xl text-[#3a4750] leading-relaxed">
                Our approach is transformational, not transactional. We prioritize your vision, values, and family, co-creating a roadmap that ensures an empowering and authentic transition.
              </p>
              <p className="text-sm sm:text-base lg:text-xl text-[#3a4750] leading-relaxed italic">
                “Freedom M&A didn’t just sell my company—they helped me design my next chapter.” — Sarah T., Founder
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#be3144]/10 to-[#e63950]/10 border-l-4 border-[#be3144] p-6 sm:p-8 lg:p-10 rounded-r-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <blockquote className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#303841] italic mb-6 sm:mb-8">
                "We co-create a plan rooted in your vision of freedom, exploring options that fit your life, business, and future."
              </blockquote>
            </div>
          </div>

          <div className="relative fade-in-up stagger-1">
            <img
              src="./about.jpg"
              alt="Freedom Mergers & Acquisitions Team"
              className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
              
            />
           
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 fade-in-up stagger-2">
          {values.map((value, index) => (
            <Card
              key={index}
              className="bg-white p-6 sm:p-8 text-center hover-lift group border border-[#3a4750]/10 hover:border-[#be3144]/50 transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl"
              role="article"
              aria-labelledby={`value-title-${index}`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 id={`value-title-${index}`} className="text-base sm:text-lg lg:text-xl font-semibold text-[#303841] mb-2 sm:mb-3">
                {value.title}
              </h4>
              <p className="text-sm sm:text-base text-[#3a4750] leading-relaxed">{value.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-3xl p-8 sm:p-10 lg:p-12 text-center fade-in-up stagger-3 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                ref={(el) => (countRefs.current[index] = el?.querySelector('span'))}
              >
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#d3d6db] mb-1 sm:mb-2 ">
                  <span aria-live="polite">{0}</span>
                  {stat.suffix}
                </div>
                <div className="text-[#d3d6db]/80 text-sm sm:text-base lg:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-[#d3d6db]/80 mt-6 sm:mt-8 leading-relaxed">
            “Our proven track record includes over 500 successful transitions, with a 95% client satisfaction rate.” — Trusted by founders nationwide
          </p>
        </div>

        <section className="mt-12 sm:mt-16 lg:mt-20 py-8 sm:py-12 lg:py-16 bg-[#303841] rounded-3xl fade-in-up stagger-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Define Your Freedom?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed">
                Partner with Freedom M&A to transform your business journey into a path toward personal and financial freedom. Schedule a consultation or download our comprehensive guide today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  className="group bg-gradient-to-r from-[#be3144] to-[#e63950] text-white hover:bg-[#e63950] font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                  aria-label="Schedule a consultation"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
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

export default AboutSection;