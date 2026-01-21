import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, MessageCircle, X, Minimize2, Mail, UserPlus } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [hasShownProactive, setHasShownProactive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "", phone: "" });
  const [apiError, setApiError] = useState(false);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const scrollAreaRef = useRef(null);

  // Meeting booking conversation flow state - enhanced for Calendly
  // Meeting booking conversation flow state - enhanced for Calendly
  const [conversationMode, setConversationMode] = useState<
    'normal' | 'booking_name' | 'booking_email' | 'booking_time' | 'booking_confirm'
  >('normal');
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    timePreference: "",
    datePreference: "",
    suggestedTime: null as { startTime: string; formatted: string } | null,
    alternatives: [] as { startTime: string; formatted: string }[],
  });

  const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api$/, '');
  const API_ENDPOINTS = {
    chat: `${API_BASE_URL}/api/ai-chat/chat`,
    search: `${API_BASE_URL}/api/ai-chat/search`,
    collectLead: `${API_BASE_URL}/api/ai-chat/lead`,
    topics: `${API_BASE_URL}/api/ai-chat/topics`,
    feedback: `${API_BASE_URL}/api/ai-chat/feedback`,
    health: `${API_BASE_URL}/api/ai-chat/health`,
    bookMeeting: `${API_BASE_URL}/api/ai-chat/book-meeting`,
    checkAvailability: `${API_BASE_URL}/api/ai-chat/check-availability`,
    confirmBooking: `${API_BASE_URL}/api/ai-chat/confirm-booking`,
  };
  const CALENDLY_LINK = "https://calendly.com/dave-freedommergers/30min";

  // Generate session ID and handle proactive message
  useEffect(() => {
    const newSessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);

    const badgeTimer = setTimeout(() => {
      setShowBadge(true);
    }, 3000);

    const proactiveTimer = setTimeout(() => {
      if (!hasShownProactive && !isOpen) {
        setMessages([
          {
            role: "bot",
            content:
              "👋 Hi there! I'm Dave Marshall's AI assistant from Freedom Mergers. I can help with mergers, acquisitions, and financial planning questions. How can I assist you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setHasShownProactive(true);
        setShowBadge(true);
      }
    }, 4000);

    return () => {
      clearTimeout(badgeTimer);
      clearTimeout(proactiveTimer);
    };
  }, [hasShownProactive, isOpen]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // API call function with error handling
  const makeApiCall = async (endpoint, data, method = "POST") => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          result,
        });
        setApiError(true);
        return result;
      }

      setApiError(false);
      return result;
    } catch (error) {
      console.error("Network Error:", {
        message: error.message,
        name: error.name,
        endpoint,
        data,
      });
      setApiError(true);
      return {
        success: false,
        message: "We're experiencing technical difficulties. Please contact Dave Marshall directly at",
        contact: {
          email: "info@freedommergers.com",
          emailLink: "mailto:info@freedommergers.com",
          schedule: CALENDLY_LINK,
        },
      };
    }
  };

  // Helper function to detect meeting booking intent
  const detectMeetingIntent = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    const meetingPhrases = [
      'book a meeting',
      'schedule a meeting',
      'set up a meeting',
      'want to book',
      'want to schedule',
      'schedule consultation',
      'book consultation',
      'schedule an appointment',
      'book an appointment',
      'i want a meeting',
      'can i book',
      'can i schedule',
      'need a meeting',
      'arrange a meeting'
    ];
    return meetingPhrases.some(phrase => lowerMessage.includes(phrase));
  };

  // Handle meeting booking submission
  const handleMeetingBooking = async (name: string, email: string) => {
    try {
      const result = await makeApiCall(API_ENDPOINTS.bookMeeting, {
        name,
        email,
        sessionId,
      });

      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (result.success) {
        if (result.leadId && Number.isInteger(result.leadId) && result.leadId > 0) {
          setLeadId(result.leadId);
        }
        setLeadInfo({ name, email, phone: "" });

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: result.message,
            timestamp,
            isSuccess: true,
            contactInfo: {
              email: result.nextSteps?.contact || "info@freedommergers.com",
              emailLink: `mailto:${result.nextSteps?.contact || "info@freedommergers.com"}`,
              schedule: result.nextSteps?.calendly || CALENDLY_LINK,
            },
          },
        ]);

        // Open Calendly after success
        setTimeout(() => {
          window.open(CALENDLY_LINK, "_blank");
        }, 1500);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: result.message || "There was an issue booking your meeting. Please try again or contact us directly.",
            timestamp,
            isError: true,
            contactInfo: {
              email: "info@freedommergers.com",
              emailLink: "mailto:info@freedommergers.com",
              schedule: CALENDLY_LINK,
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Meeting booking error:", error);
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, there was an error processing your meeting request. Please contact us directly.",
          timestamp,
          isError: true,
          contactInfo: {
            email: "info@freedommergers.com",
            emailLink: "mailto:info@freedommergers.com",
            schedule: CALENDLY_LINK,
          },
        },
      ]);
    }
  };

  // Handle sending user messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp,
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      // Handle conversation modes for meeting booking
      if (conversationMode === 'booking_name') {
        // User is providing their name
        const name = userMessage.trim();
        if (name.length < 2) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: "That name seems too short. Could you please provide your full name?",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsLoading(false);
          return;
        }

        setBookingData({ ...bookingData, name });
        setConversationMode('booking_email');
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: `Great, ${name}! 📧 **Now, what's your email address?** We'll send you a confirmation with the meeting details.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (conversationMode === 'booking_email') {
        // User is providing their email
        const email = userMessage.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: "That doesn't look like a valid email address. Please enter a valid email (e.g., your.name@example.com)",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsLoading(false);
          return;
        }

        // Save email and ask for time preference
        setBookingData({ ...bookingData, email });
        setConversationMode('booking_time');
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: `Thanks, ${bookingData.name}! 📅 **When would you like to schedule your meeting?**\n\nYou can say things like:\n• "Tomorrow at 2pm"\n• "Next Monday morning"\n• "Friday afternoon"`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (conversationMode === 'booking_time') {
        // User is providing their preferred time
        let timePreference = userMessage.trim().toLowerCase();

        // Helper function to check if message looks like a time/date
        const looksLikeTimeOrDate = (msg: string): boolean => {
          const timeKeywords = [
            'today', 'tomorrow', 'tomrrow', 'tmrw', 'tmr', 'monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday', 'sunday', 'mon', 'tue', 'wed', 'thu', 'fri',
            'sat', 'sun', 'morning', 'afternoon', 'evening', 'night', 'am', 'pm', 'next week',
            'day after', 'at ', ':00', ':30'
          ];
          const hasTimeWord = timeKeywords.some(kw => msg.includes(kw));
          const hasNumber = /\d/.test(msg);
          return hasTimeWord || hasNumber;
        };

        // Helper function to check if message is a question or unrelated
        const isQuestionOrUnrelated = (msg: string): boolean => {
          const questionWords = ['who', 'what', 'where', 'when', 'why', 'how', 'is ', 'are ', 'can ', 'do ', 'does', 'tell me', 'explain', 'about'];
          const isQuestion = questionWords.some(qw => msg.startsWith(qw) || msg.includes('?'));
          const looksLikeTime = looksLikeTimeOrDate(msg);
          return isQuestion && !looksLikeTime;
        };

        // Handle confirmation responses that shouldn't trigger availability check
        if (timePreference === 'yes' || timePreference === 'ok' || timePreference === 'sure' || timePreference === 'yeah' || timePreference === 'yep') {
          // User is confirming the date but we still need a time
          const dateStr = bookingData.datePreference
            ? new Date(bookingData.datePreference).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            : 'that day';

          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: `Great! What time on ${dateStr} works best for you? (e.g., "2pm", "10:30 AM", "afternoon")`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsLoading(false);
          return;
        }

        // Check if user is asking a question instead of providing time
        if (isQuestionOrUnrelated(timePreference)) {
          // Answer the question via AI chat, then remind about booking
          try {
            const chatResult = await makeApiCall(API_ENDPOINTS.chat, {
              message: userMessage.trim(),
              sessionId,
            });

            const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            setMessages((prev) => [
              ...prev,
              {
                role: "bot",
                content: chatResult.message + `\n\n📅 **Back to booking:** When would you like to schedule your meeting, ${bookingData.name}?`,
                timestamp: botTimestamp,
              },
            ]);
          } catch (error) {
            setMessages((prev) => [
              ...prev,
              {
                role: "bot",
                content: `Great question! For detailed info, I recommend discussing with Dave Marshall directly.\n\n📅 **Back to booking:** When would you like to schedule your meeting?`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }
          setIsLoading(false);
          return;
        }

        // If we already have a date pending, combine it with this new time input
        if (bookingData.datePreference) {
          // e.g., "Answer: 2pm" -> combined with date "2026-01-20"
          const dateObj = new Date(bookingData.datePreference);
          const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
          timePreference = `on ${dateStr} at ${userMessage.trim()}`;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "⏳ Checking availability...",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        try {
          const result = await makeApiCall(API_ENDPOINTS.checkAvailability, {
            timePreference,
            name: bookingData.name,
            email: bookingData.email,
            sessionId,
          });

          if (result.success) {
            if (result.needsTime) {
              // Backend recognized the date but needs a specific time
              setBookingData({
                ...bookingData,
                datePreference: result.parsedDate // Store the parsed date
              });

              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content: result.message || "What time would you like?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ]);
              // Stay in booking_time mode to get the time next
            }
            else if (result.available) {
              // Time is available
              setBookingData({
                ...bookingData,
                timePreference,
                datePreference: "", // Clear pending date
                suggestedTime: result.suggestedTime,
                alternatives: result.alternatives || [],
              });
              setConversationMode('booking_confirm');

              let confirmMessage = `✅ Perfect! **${result.suggestedTime.formatted}** is available.\n\nShall I book that for you?`;

              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content: confirmMessage,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ]);
            } else if (result.alternatives && result.alternatives.length > 0) {
              // Time not available but have alternatives
              setBookingData({
                ...bookingData,
                timePreference,
                datePreference: "",
                suggestedTime: result.alternatives[0],
                alternatives: result.alternatives,
              });
              setConversationMode('booking_confirm');

              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content: `${result.message}\n\n${result.alternatives.map((alt, i) => `${i + 1}. ${alt.formatted}`).join('\n')}\n\nWhatever works best for you - just type the number or propose another time.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ]);
            } else {
              // No availability - show fallback
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content: result.message || "Sorry, I couldn't find available times, but you can check the full calendar here:",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  contactInfo: {
                    email: "info@freedommergers.com",
                    emailLink: "mailto:info@freedommergers.com",
                    schedule: CALENDLY_LINK,
                  },
                },
              ]);
              // Reset and go back to normal
              setConversationMode('normal');
              setBookingData({ name: "", email: "", timePreference: "", datePreference: "", suggestedTime: null, alternatives: [] });
            }
          } else {
            // Handle specific failure reasons
            if (result.reason === 'not_a_time') {
              // The backend couldn't parse a time, so treat this as a question/chat
              try {
                const chatResult = await makeApiCall(API_ENDPOINTS.chat, {
                  message: userMessage.trim(),
                  sessionId,
                });

                const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: chatResult.message + `\n\n📅 **Back to booking:** When would you like to schedule your meeting, ${bookingData.name}?`,
                    timestamp: botTimestamp,
                  },
                ]);
              } catch (chatError) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: `I didn't quite catch a time there. Which day and time works best for you? (e.g., "Tomorrow at 2pm")`,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }
              setIsLoading(false);
              return;
            }

            // General API error or other failure
            setMessages((prev) => [
              ...prev,
              {
                role: "bot",
                content: result.message || "Sorry, I couldn't find available times, but you can check the full calendar here:",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                contactInfo: {
                  email: "info@freedommergers.com",
                  emailLink: "mailto:info@freedommergers.com",
                  schedule: CALENDLY_LINK,
                },
              },
            ]);
            // Reset and go back to normal
            setConversationMode('normal');
            setBookingData({ name: "", email: "", timePreference: "", datePreference: "", suggestedTime: null, alternatives: [] });
          }
        } catch (error) {
          console.error("Availability check error:", error);
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: "I'm having trouble checking availability. Would you like to try another time, or book directly?",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              contactInfo: {
                email: "info@freedommergers.com",
                emailLink: "mailto:info@freedommergers.com",
                schedule: CALENDLY_LINK,
              },
            },
          ]);
        }
        setIsLoading(false);
        return;
      }

      if (conversationMode === 'booking_confirm') {
        const response = userMessage.trim().toLowerCase();

        // Check if user selected a numbered alternative (strict matching: "1", "#1", "Option 1")
        const numberMatch = response.match(/^(?:option\s+|#\s*)?(\d+)\.?$/);
        let selectedAlternative = null;

        if (numberMatch && bookingData.alternatives.length > 0) {
          const index = parseInt(numberMatch[1]) - 1;
          if (index >= 0 && index < bookingData.alternatives.length) {
            selectedAlternative = bookingData.alternatives[index];
            setBookingData({
              ...bookingData,
              suggestedTime: selectedAlternative,
            });
          }
        }

        if (response === 'yes' || response === 'confirm' || response === 'book' || response === 'ok' || selectedAlternative) {
          // Confirm and book
          const timeToBook = selectedAlternative || bookingData.suggestedTime;

          if (!timeToBook) {
            setMessages((prev) => [
              ...prev,
              {
                role: "bot",
                content: "Something went wrong. Please try again or book directly:",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                contactInfo: { schedule: CALENDLY_LINK },
              },
            ]);
            setConversationMode('normal');
            setBookingData({ name: "", email: "", timePreference: "", datePreference: "", suggestedTime: null, alternatives: [] });
            setIsLoading(false);
            return;
          }

          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: `⏳ Booking your meeting for ${timeToBook.formatted}...`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          try {
            const result = await makeApiCall(API_ENDPOINTS.confirmBooking, {
              name: bookingData.name,
              email: bookingData.email,
              startTime: timeToBook.startTime,
              sessionId,
            });

            if (result.success) {
              setLeadId(result.leadId);
              setLeadInfo({ name: bookingData.name, email: bookingData.email, phone: "" });

              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content: result.message,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isSuccess: true,
                  contactInfo: {
                    email: "info@freedommergers.com",
                    emailLink: "mailto:info@freedommergers.com",
                    schedule: result.booking?.bookingUrl || CALENDLY_LINK,
                  },
                },
              ]);
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content: result.message || "There was an issue booking. Please try the link below:",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isError: true,
                  contactInfo: { schedule: result.fallbackUrl || CALENDLY_LINK },
                },
              ]);
            }
          } catch (error) {
            console.error("Booking confirmation error:", error);
            setMessages((prev) => [
              ...prev,
              {
                role: "bot",
                content: "Sorry, there was an error booking your meeting. Please try the link below:",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isError: true,
                contactInfo: { schedule: CALENDLY_LINK },
              },
            ]);
          }

          // Reset booking state
          setConversationMode('normal');
          setBookingData({ name: "", email: "", timePreference: "", datePreference: "", suggestedTime: null, alternatives: [] });
          setIsLoading(false);
          return;
        } else if (
          response === 'no' ||
          response === 'nope' ||
          response === 'different' ||
          response === 'change' ||
          response.includes('another day') ||
          response.includes('another time') ||
          response.includes('different day') ||
          response.includes('different time') ||
          response.includes('not this') ||
          response.includes('other time') ||
          response.includes('other day') ||
          response.includes('cancel') ||
          response.includes('reschedule')
        ) {
          // User wants a different time - clear date preference and ask again
          setBookingData({
            ...bookingData,
            datePreference: "",
            suggestedTime: null,
            alternatives: [],
          });
          setConversationMode('booking_time');
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: `No problem, ${bookingData.name}! 📅 When would you prefer to schedule your meeting?\n\nYou can say things like:\n• "Tomorrow at 2pm"\n• "Next Monday morning"\n• "Friday afternoon"`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsLoading(false);
          return;
        } else {
          // Treat as a new time preference - CHECK IMMEDIATELY
          setConversationMode('booking_time');
          const timePreference = userMessage.trim();

          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: "⏳ Checking availability for that time...",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          try {
            const result = await makeApiCall(API_ENDPOINTS.checkAvailability, {
              timePreference,
              name: bookingData.name,
              email: bookingData.email,
              sessionId,
            });

            if (result.success) {
              if (result.needsTime) {
                setBookingData({
                  ...bookingData,
                  datePreference: result.parsedDate
                });

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: result.message || "What time would you like?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }
              else if (result.available) {
                setBookingData({
                  ...bookingData,
                  timePreference,
                  datePreference: "",
                  suggestedTime: result.suggestedTime,
                  alternatives: result.alternatives || [],
                });
                setConversationMode('booking_confirm');

                let confirmMessage = `✅ Perfect! **${result.suggestedTime.formatted}** is available.\n\nShall I book that for you?`;

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: confirmMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              } else if (result.alternatives && result.alternatives.length > 0) {
                setBookingData({
                  ...bookingData,
                  timePreference,
                  datePreference: "",
                  suggestedTime: result.alternatives[0],
                  alternatives: result.alternatives,
                });
                setConversationMode('booking_confirm');

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: `${result.message}\n\n${result.alternatives.map((alt, i) => `${i + 1}. ${alt.formatted}`).join('\n')}\n\nWhatever works best for you - just type the number or propose another time.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              } else {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: result.message || "Sorry, I couldn't find available times, but you can check the full calendar here:",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    contactInfo: {
                      email: "info@freedommergers.com",
                      emailLink: "mailto:info@freedommergers.com",
                      schedule: CALENDLY_LINK,
                    },
                  },
                ]);
                setConversationMode('normal');
                setBookingData({ name: "", email: "", timePreference: "", datePreference: "", suggestedTime: null, alternatives: [] });
              }
            }
          } catch (error) {
            console.error("Availability check error:", error);
            setMessages((prev) => [
              ...prev,
              {
                role: "bot",
                content: "I'm having trouble checking availability. Would you like to try another time, or book directly?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                contactInfo: {
                  email: "info@freedommergers.com",
                  emailLink: "mailto:info@freedommergers.com",
                  schedule: CALENDLY_LINK,
                },
              },
            ]);
          }
          setIsLoading(false);
          return;
        }
      }

      // Normal conversation mode - check for meeting intent
      if (detectMeetingIntent(userMessage)) {
        setConversationMode('booking_name');
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "I'd be happy to help you book a meeting with Dave Marshall and our team! 📅\n\n**First, could you please tell me your name?**",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsLoading(false);
        return;
      }

      // Regular chat flow
      const chatData = {
        message: userMessage.trim(),
        sessionId,
        ...(leadId && Number.isInteger(leadId) && leadId > 0 ? { leadId } : {}),
        ...(leadInfo.email && { email: leadInfo.email }),
        ...(leadInfo.name && { name: leadInfo.name }),
        ...(leadInfo.phone && { phone: leadInfo.phone }),
      };

      const result = await makeApiCall(API_ENDPOINTS.chat, chatData);

      if (result.success) {
        const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: result.message,
            timestamp: botTimestamp,
            responseTime: result.responseTime,
            contactInfo: result.contact || null,
          },
        ]);

        if (result.sessionId) setSessionId(result.sessionId);
        if (result.leadId && Number.isInteger(result.leadId) && result.leadId > 0) {
          setLeadId(result.leadId);
        }

        if (
          result.message.toLowerCase().includes("contact") ||
          result.message.toLowerCase().includes("consultation") ||
          result.message.toLowerCase().includes("schedule") ||
          result.message.toLowerCase().includes("interested") ||
          result.message.toLowerCase().includes("learn more")
        ) {
          setTimeout(() => {
            if (!leadInfo.email) {
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  content:
                    "Would you like to provide your contact information so Dave Marshall and our team can follow up with personalized assistance?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  showLeadButton: true,
                },
              ]);
            }
          }, 2000);
        }
      } else {
        const errorTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: result.message || result.error || "Service temporarily unavailable",
            timestamp: errorTimestamp,
            isError: true,
            contactInfo: result.contact || null,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      let errorMessage = "I apologize, but I couldn't process your request. Please try again or contact us directly for assistance.";
      let contactInfo = null;

      if (error.message && error.message.includes("API request failed")) {
        try {
          const response = await fetch(API_ENDPOINTS.chat, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: userMessage.trim(),
              sessionId,
              ...(leadId && Number.isInteger(leadId) && leadId > 0 ? { leadId } : {}),
              ...(leadInfo.email && { email: leadInfo.email }),
              ...(leadInfo.name && { name: leadInfo.name }),
              ...(leadInfo.phone && { phone: leadInfo.phone }),
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
            if (errorData.contact) contactInfo = errorData.contact;
          }
        } catch (retryError) {
          console.error("Error getting detailed error message:", retryError);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: errorMessage,
          timestamp: errorTimestamp,
          isError: true,
          contactInfo: contactInfo,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle lead form submission
  const handleLeadSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!leadInfo.name || leadInfo.name.length < 2 || leadInfo.name.length > 255) {
      alert("Name must be between 2 and 255 characters.");
      return;
    }
    if (!leadInfo.email || !emailRegex.test(leadInfo.email)) {
      alert("Please provide a valid email address.");
      return;
    }
    if (leadInfo.phone && !phoneRegex.test(leadInfo.phone.replace(/[\s\-\(\)]/g, ""))) {
      alert("Please provide a valid phone number (up to 50 characters).");
      return;
    }

    setIsLeadSubmitting(true);
    try {
      const leadData = {
        name: leadInfo.name.trim(),
        email: leadInfo.email.trim(),
        phone: leadInfo.phone.trim(),
        interest: "Chatbot Inquiry",
        message: "Lead collected through chatbot interaction",
        sessionId,
      };

      const result = await makeApiCall(API_ENDPOINTS.collectLead, leadData);

      if (result.success) {
        const newLeadId = result.leadId;
        if (Number.isInteger(newLeadId) && newLeadId > 0) {
          setLeadId(newLeadId);
        } else {
          console.warn("Invalid leadId received:", newLeadId);
        }
        setShowLeadForm(false);

        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: `Thank you, ${leadInfo.name}! Your information has been saved, and a confirmation email has been sent to ${leadInfo.email}. You'll be redirected to schedule a consultation with Dave Marshall and our team.`,
            timestamp,
            isSuccess: true,
            contactInfo: {
              email: result.nextSteps?.contact || "info@freedommergers.com",
              emailLink: result.nextSteps?.contact ? `mailto:${result.nextSteps.contact}` : "mailto:info@freedommergers.com",
              schedule: CALENDLY_LINK,
            },
          },
        ]);

        setTimeout(() => {
          window.open(CALENDLY_LINK, "_blank");
        }, 1000);
      } else {
        const errorTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: result.message || result.error || "Failed to save your information. Please try again.",
            timestamp: errorTimestamp,
            isError: true,
            contactInfo: result.contact || {
              email: "info@freedommergers.com",
              emailLink: "mailto:info@freedommergers.com",
              schedule: CALENDLY_LINK,
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Lead collection error:", error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, there was an error saving your information. Please try again or contact us directly.",
          timestamp: errorTimestamp,
          isError: true,
          contactInfo: {
            email: "info@freedommergers.com",
            emailLink: "mailto:info@freedommergers.com",
            schedule: CALENDLY_LINK,
          },
        },
      ]);
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  const showLeadCollection = () => {
    setShowLeadForm(true);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    setShowBadge(false);

    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            role: "bot",
            content:
              "Hi! I'm Dave Marshall's AI assistant from Freedom Mergers 👋 I specialize in helping with questions about mergers, acquisitions, business valuations, and exit strategy planning. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 500);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    setShowLeadForm(false);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const renderMessageContent = (message) => {
    const content = message.content;
    const contactInfo = message.contactInfo;

    // Function to format text with markdown-like formatting
    const formatText = (text: string) => {
      // Split by numbered list items (1. **Title**: content)
      const listItemRegex = /(\d+\.\s*\*\*[^*]+\*\*:?)/g;
      const hasNumberedList = listItemRegex.test(text);

      if (hasNumberedList) {
        const parts = text.split(/(\d+\.\s*\*\*[^*]+\*\*:?)/g);
        return (
          <div className="space-y-2">
            {parts.map((part, idx) => {
              // Check if this is a numbered header (e.g., "1. **Mergers and Acquisitions**:")
              const headerMatch = part.match(/^(\d+)\.\s*\*\*([^*]+)\*\*:?$/);
              if (headerMatch) {
                return (
                  <div key={idx} className="flex items-start gap-2 mt-3 first:mt-0">
                    <span className="bg-white bg-opacity-30 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {headerMatch[1]}
                    </span>
                    <span className="font-semibold">{headerMatch[2]}</span>
                  </div>
                );
              }
              // Regular content
              if (part.trim()) {
                return (
                  <div key={idx} className="pl-7 text-sm opacity-90">
                    {formatBoldAndLinks(part.trim())}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }

      // For regular text, format bold text and links
      return <span>{formatBoldAndLinks(text)}</span>;
    };

    // Function to format bold text (**text**) with clean styling
    const formatBoldAndLinks = (text: string) => {
      // Split by bold markers **text**
      const parts = text.split(/(\*\*[^*]+\*\*)/g);

      return parts.map((part, idx) => {
        // Check if this is bold text
        const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
        if (boldMatch) {
          return (
            <strong key={idx} className="font-bold underline decoration-2 underline-offset-2">
              {boldMatch[1]}
            </strong>
          );
        }
        // Regular text - format links
        return <span key={idx}>{formatLinks(part)}</span>;
      });
    };

    // Function to format links (Calendly, email, etc.)
    const formatLinks = (text: string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const emailRegex = /([\w.-]+@[\w.-]+\.\w+)/g;

      // First split by URLs
      const parts = text.split(urlRegex);

      return parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <button
              key={index}
              onClick={() => window.open(part, "_blank")}
              className="text-black hover:text-white underline hover:no-underline mx-1 font-medium"
            >
              {part.includes("calendly") ? "📅 Schedule Consultation" : "🔗 View Link"}
            </button>
          );
        }
        // Check for email in the part
        const emailParts = part.split(emailRegex);
        return emailParts.map((emailPart, emailIndex) => {
          if (emailPart.match(emailRegex)) {
            return (
              <button
                key={`${index}-${emailIndex}`}
                onClick={() => window.open(`mailto:${emailPart}`, "_blank")}
                className="text-black  underline hover:no-underline mx-1 font-medium"
              >
                {emailPart}
              </button>
            );
          }
          return <span key={`${index}-${emailIndex}`}>{emailPart}</span>;
        });
      });
    };

    if (contactInfo) {
      return (
        <div className="space-y-3">
          <div className="leading-relaxed break-words">{formatText(content)}</div>
          <div className="flex flex-col gap-2 pt-2 border-t border-opacity-30">
            {contactInfo.emailLink && (
              <button
                onClick={() => window.open(contactInfo.emailLink, "_blank")}
                className="flex items-center gap-2 text-sm hover:underline text-left bg-white bg-opacity-20 rounded-lg p-2 hover:bg-opacity-30 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Email: {contactInfo.email}</span>
              </button>
            )}
            {contactInfo.schedule && (
              <button
                onClick={() => window.open(contactInfo.schedule, "_blank")}
                className="flex items-center gap-2 text-sm hover:underline text-left bg-white bg-opacity-20 rounded-lg p-2 hover:bg-opacity-30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Schedule Consultation</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="leading-relaxed break-words">
        {formatText(content)}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[9999]">
        <div className="relative">
          <button
            onClick={toggleChat}
            className={`rounded-full w-14 h-14 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${apiError ? "bg-orange-500 hover:bg-orange-600" : "bg-[#be3144] hover:bg-[#a12b3b]"
              }`}
            aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
          >
            {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
          </button>
          {showBadge && !isOpen && (
            <div className="absolute -top-2 -right-2 bg-[#be3144] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              1
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 bg-[#d3d6db] border border-[#303841] rounded-2xl shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-[9998] ${isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
            }`}
        >
          <div className="flex-shrink-0 p-4 border-b bg-[#3a4750] rounded-t-2xl flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-[#d3d6db] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#303841]" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#d3d6db] ${apiError ? "bg-orange-400" : "bg-green-400"
                    }`}
                ></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Freedom Mergers AI</h2>
                <p className="text-xs text-[#d3d6db]">{apiError ? "Connection issues" : "Dave Marshall's Assistant"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isMinimized ? maximizeChat : minimizeChat}
                className="text-white hover:text-[#d3d6db] hover:bg-[#303841] rounded-full w-8 h-8"
                aria-label={isMinimized ? "Maximize chatbot" : "Minimize chatbot"}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:text-[#d3d6db] hover:bg-[#303841] rounded-full w-8 h-8"
                aria-label="Close chatbot"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {showLeadForm && (
                <div className="absolute inset-0 bg-[#d3d6db] z-10 p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-4 mt-12">
                    <h3 className="text-lg font-semibold text-[#303841]">Contact Information</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLeadForm(false)}
                      className="text-[#303841] hover:bg-[#3a4750] hover:text-white rounded-full"
                      aria-label="Close lead form"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <Input
                        type="text"
                        placeholder="Your Name *"
                        value={leadInfo.name}
                        onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                        className="bg-white border border-[#303841] focus:ring-2 focus:ring-[#be3144] rounded-lg"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address *"
                        value={leadInfo.email}
                        onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                        className="bg-white border border-[#303841] focus:ring-2 focus:ring-[#be3144] rounded-lg"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={leadInfo.phone}
                        onChange={(e) => setLeadInfo({ ...leadInfo, phone: e.target.value })}
                        className="bg-white border border-[#303841] focus:ring-2 focus:ring-[#be3144] rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleLeadSubmit}
                        disabled={isLeadSubmitting}
                        className={`bg-[#be3144] hover:bg-[#a12b3b] text-white flex-1 rounded-lg relative ${isLeadSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        aria-label="Submit contact information"
                      >
                        {isLeadSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
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
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                            Submitting...
                          </div>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowLeadForm(false)}
                        className="border-[#303841] text-[#303841] hover:bg-[#3a4750] hover:text-white rounded-lg"
                        aria-label="Cancel lead form"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="h-[356px] overflow-hidden">
                <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                          } animate-fade-in`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${message.role === "user"
                            ? "bg-[#be3144] text-white border border-[#be3144] mr-2"
                            : message.isError
                              ? "bg-red-100 text-red-800 border border-red-300 ml-2"
                              : message.isSuccess
                                ? "bg-green-100 text-green-800 border border-green-300 ml-2"
                                : "bg-[#d3d6db] text-[#303841] border border-[#303841] ml-2"
                            } flex flex-col gap-1 transition-all duration-200 hover:shadow-md`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === "bot" && (
                              <Bot
                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${message.isError
                                  ? "text-red-600"
                                  : message.isSuccess
                                    ? "text-green-600"
                                    : "text-[#303841]"
                                  }`}
                              />
                            )}
                            <span className="leading-relaxed break-words flex-1">{renderMessageContent(message)}</span>
                            {message.role === "user" && <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />}
                          </div>
                          {message.showLeadButton && !leadInfo.email && (
                            <Button
                              size="sm"
                              onClick={showLeadCollection}
                              className="bg-[#be3144] hover:bg-[#a12b3b] text-white mt-2 flex items-center gap-2 rounded-lg"
                              aria-label="Provide contact information"
                            >
                              <UserPlus className="w-3 h-3" />
                              Provide Contact Info
                            </Button>
                          )}
                          <div
                            className={`text-xs opacity-70 text-right ${message.role === "user"
                              ? "text-[#d3d6db]"
                              : message.isError
                                ? "text-red-600"
                                : message.isSuccess
                                  ? "text-green-600"
                                  : "text-[#3a4750]"
                              }`}
                          >
                            {message.timestamp}
                            {message.responseTime && <span className="ml-2">({message.responseTime}ms)</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-[#d3d6db] text-[#303841] border border-[#303841] rounded-2xl p-3 max-w-[85%] flex items-center gap-2 text-sm ml-2">
                          <Bot className="w-4 h-4 text-[#303841] flex-shrink-0" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#be3144] rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-[#be3144] rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-[#be3144] rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-[#3a4750] ml-2">AI Assistant is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex-shrink-0 p-4 border-t bg-[#d3d6db] rounded-b-2xl h-20">
                <div className="flex gap-3 items-center h-full">
                  <div className="flex-1">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about mergers, acquisitions, valuations..."
                      className="bg-white border border-[#303841] focus:ring-2 focus:ring-[#be3144] focus:border-[#be3144] rounded-xl text-sm py-2 px-4 h-10 w-full text-[#303841]"
                      autoFocus
                      disabled={isLoading}
                      maxLength={2000}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      aria-label="Type your message"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-[#be3144] hover:bg-[#a12b3b] text-white h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;