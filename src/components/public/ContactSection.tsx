import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, ArrowRight, Shield } from "lucide-react";
import { api } from '../lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    revenue: '',
    message: '',
    consent: false,
  });
  const [showToast, setShowToast] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Start your journey with a quick message.",
      value: "hello@freedomma.com",
      action: "mailto:hello@freedomma.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our expert team.",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Connect at our offices nationwide.",
      value: "Multiple US Locations",
      action: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "Available when you need us most.",
      value: "Mon-Fri 9AM-6PM EST",
      action: "#",
    },
  ];

  // Define the mutation for form submission
  const submitContactForm = async (formData) => {
    const response = await api.post('/contacts/submit', formData, {
      timeout: 10000, // 10-second timeout
    });
    return response.data;
  };

  const { mutate, isPending, error, isSuccess, data } = useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      console.log('Form submission successful:', data);
      setShowToast(true);
      // Reset form fields
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        company: '',
        revenue: '',
        message: '',
        consent: false,
      });
    },
    onError: (err) => {
      console.error('Form submission error:', err);
    },
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setShowToast(true);
      return;
    }
    mutate(formData);
  };

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const renderResponse = (text) => {
    return (
      <p className="text-gray-800 text-sm text-left">
        {text.split(/(info@freedommergers\.com|https:\/\/calendly\.com\/dave-marshall-freedom-mergers)/g).map((part, i) => {
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
          if (part.startsWith("https://calendly.com")) {
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
    <section className="py-20 sm:py-24 lg:py-28 bg-[#d3d6db] overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20 fade-in-up" role="region" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#303841] mb-4 sm:mb-6">
            Ready to Define Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#be3144] to-[#e63950]">
              Freedom?
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#3a4750] leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Let Freedom M&A guide your business and life toward true freedom. Schedule a confidential consultation to explore your path forward.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
          {/* Contact Form */}
          <Card className="p-6 sm:p-8 lg:p-10 bg-white border border-[#3a4750]/10 hover:border-[#be3144]/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl fade-in-up" role="form" aria-labelledby="form-heading">
            <div className="mb-6 sm:mb-8">
              <h3 id="form-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#303841] mb-3 sm:mb-4">
                Start Your Journey
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-[#3a4750] leading-relaxed">
                Complete this form for a confidential consultation. We’ll discuss your goals and craft a plan to achieve your vision of freedom.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#303841] mb-2" htmlFor="first_name">
                    First Name
                  </label>
                  <Input id="first_name" placeholder="John" value={formData.first_name} onChange={handleInputChange} className="w-full border-[#3a4750]/20 focus:border-[#be3144]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303841] mb-2" htmlFor="last_name">
                    Last Name
                  </label>
                  <Input id="last_name" placeholder="Smith" value={formData.last_name} onChange={handleInputChange} className="w-full border-[#3a4750]/20 focus:border-[#be3144]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303841] mb-2" htmlFor="email">
                  Email
                </label>
                <Input id="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} className="w-full border-[#3a4750]/20 focus:border-[#be3144]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303841] mb-2" htmlFor="company">
                  Company
                </label>
                <Input id="company" placeholder="Your Company Name" value={formData.company} onChange={handleInputChange} className="w-full border-[#3a4750]/20 focus:border-[#be3144]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303841] mb-2" htmlFor="revenue">
                  Annual Revenue
                </label>
                <select
                  id="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-[#3a4750]/20 focus:border-[#be3144] rounded-md bg-white text-[#3a4750]"
                >
                  <option value="">Select revenue range</option>
                  <option>$75M - $100M</option>
                  <option>$100M - $125M</option>
                  <option>$125M - $150M</option>
                  <option>$150M+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303841] mb-2" htmlFor="message">
                  How do you define Freedom?
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your goals, vision, and what freedom means to you..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full h-32 border-[#3a4750]/20 focus:border-[#be3144]"
                />
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="consent" checked={formData.consent} onChange={handleInputChange} className="mt-1" />
                <label htmlFor="consent" className="text-sm text-[#3a4750]">
                  I agree to receive communications from Freedom M&A and understand that all information shared will be kept strictly confidential.
                </label>
              </div>
              <Button
                variant="premium"
                size="lg"
                type="submit"
                disabled={isPending || !formData.consent}
                className="w-full group bg-gradient-to-r from-[#be3144] to-[#e63950] text-white hover:bg-[#be3144] transition-colors duration-300 py-3 sm:py-4 rounded-xl shadow-md transform hover:scale-105"
                aria-label={isPending ? 'Submitting...' : 'Schedule Consultation'}
              >
                {isPending ? 'Submitting...' : 'Schedule Consultation'}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg shadow">
                {renderResponse(
                  error.response?.data?.message ||
                  error.response?.data?.details?.join('. ') ||
                  'Failed to submit form. Please try again or contact us at info@freedommergers.com.'
                )}
              </div>
            )}
            {isSuccess && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg shadow">
                <p className="text-green-700 text-sm text-left">{data?.message || 'Contact form submitted successfully'}</p>
              </div>
            )}
            <div className="mt-6 flex items-center gap-2 text-sm text-[#3a4750]">
              <Shield className="w-4 h-4 text-[#be3144]" />
              Your information is protected and confidential
            </div>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 fade-in-up stagger-1">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#303841]">
                Get in Touch
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-[#3a4750] leading-relaxed">
                Taking the first step is significant. Our team is ready for a confidential conversation to shape your future.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white border border-[#3a4750]/10 hover:border-[#be3144]/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl hover-lift group cursor-pointer"
                  role="article"
                  aria-labelledby={`contact-info-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 id={`contact-info-${index}`} className="font-semibold text-[#303841] mb-1 text-base sm:text-lg">
                        {info.title}
                      </h4>
                      <p className="text-sm text-[#3a4750] mb-2">{info.description}</p>
                      <a href={info.action} className="font-medium text-[#be3144] hover:text-[#e63950] transition-colors">
                        {info.value}
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 bg-white border border-[#3a4750]/10 hover:border-[#be3144]/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
              <h4 className="font-semibold text-[#303841] mb-4 text-base sm:text-lg">Why Choose Freedom M&A</h4>
              <div className="space-y-3">
                {[
                  "180-day focused engagement",
                  "Success-based fee structure",
                  "Complete confidentiality",
                  "35+ years of experience",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#be3144] rounded-full"></div>
                    <span className="text-sm text-[#3a4750]">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#be3144] to-[#e63950] rounded-3xl p-8 sm:p-12 lg:p-16 text-center fade-in-up stagger-2 shadow-lg">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Your Journey to Freedom Starts Here
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of founders who’ve successfully transitioned to their next chapter with Freedom M&A. Let’s discuss your vision of freedom today.
          </p>
          <Button
            size="lg"
            className="group bg-white text-[#303841] hover:bg-[#d3d6db] font-bold text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300"
            aria-label="Book Your Consultation"
          >
            Book Your Consultation
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="bg-green-50 border-green-200 shadow-lg max-w-sm animate-slide-in">
            <AlertTitle className="text-green-700 font-semibold">Success</AlertTitle>
            <AlertDescription className="text-green-600">
              {isSuccess ? 'Our team will contact you soon.' : 'Please agree to the consent terms to submit the form.'}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </section>
  );
};

export default ContactSection;