import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Match backend regex

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors('Email is required');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrors('Invalid email format');
      return;
    }

    setIsSubmitting(true);
    setErrors('');
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newsletter/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setEmail('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors(error.message || 'There was a problem subscribing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      {...fadeInUp}
      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get the latest insights delivered directly to your inbox.
        </p>
        {submitSuccess && (
          <div className="mb-4 p-3 bg-[#90abff]/10 text-[#1a2957] rounded-xl text-sm">
            Subscribed successfully!
          </div>
        )}
        {errors && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-600 rounded-xl text-sm">
            {errors}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
              errors ? 'border-red-600' : 'border-gray-200'
            } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #1a2957, #90abff)',
              color: 'white',
            }}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Newsletter;