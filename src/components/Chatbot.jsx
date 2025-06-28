import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Pratik's assistant. I'm here to help you with paint recommendations, service bookings, and any questions about Divya Colour Home. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Best paint for kitchen?",
    "Book a consultation",
    "Waterproof paint options",
    "Interior vs exterior paints",
    "Pricing information",
    "Book a painter"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response function (replace with actual OpenAI API call)
  const generateBotResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Paint recommendations
    if (lowerMessage.includes('kitchen') || lowerMessage.includes('best paint')) {
      return "For kitchens, I recommend our premium interior paints with anti-bacterial properties. They're easy to clean and resist moisture. Would you like me to connect you with Pratik for a detailed consultation?";
    }
    
    // Waterproof paints
    if (lowerMessage.includes('waterproof') || lowerMessage.includes('bathroom')) {
      return "Our waterproof paints are perfect for bathrooms and exterior walls. They provide excellent protection against moisture and humidity. We have several options available. Would you like to schedule a visit to see samples?";
    }
    
    // Interior vs Exterior
    if (lowerMessage.includes('interior') && lowerMessage.includes('exterior')) {
      return "Interior paints are designed for indoor use with low VOCs and easy cleaning. Exterior paints are weather-resistant and UV-protected. Pratik can help you choose the right type based on your specific needs. Shall I book a consultation?";
    }
    
    // Booking services
    if (lowerMessage.includes('book') || lowerMessage.includes('consultation') || lowerMessage.includes('painter')) {
      return "I'd be happy to help you book a service! Pratik offers:\n• Color consultations\n• Professional painting services\n• Paint selection guidance\n\nPlease share your name and phone number, and Pratik will contact you within 24 hours.";
    }
    
    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return "Our pricing depends on the paint type, area size, and services needed. For accurate quotes, Pratik prefers to assess your requirements personally. Would you like to schedule a free consultation? You can also call us at 9096457620.";
    }
    
    // Delivery
    if (lowerMessage.includes('delivery') || lowerMessage.includes('time')) {
      return "We typically deliver paint orders within 2-3 days in the Latur area. For painting services, Pratik can usually start within a week depending on the project size. Need a specific timeline? Let me know your requirements!";
    }
    
    // Contact info
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('address')) {
      return "You can reach Divya Colour Home at:\n📞 9096457620\n📧 nikampratik2989@gmail.com\n📍 Yakatput Road, Ausa, Latur, Maharashtra 413520\n\nPratik is always ready to help with your paint needs!";
    }
    
    // Default response
    return "Thanks for your question! I'm here to help with paint recommendations, service bookings, and general inquiries. For specific technical questions, I'd recommend speaking directly with Pratik at 9096457620. Is there anything specific about our paints or services you'd like to know?";
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate API delay
    setTimeout(async () => {
      const botResponse = await generateBotResponse(messageText);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="font-semibold">Divya Colour Home Assistant</h3>
              <p className="text-sm opacity-90">Ask me about paints & services</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot size={16} className="mt-1 text-blue-500" />
                      )}
                      {message.sender === 'user' && (
                        <User size={16} className="mt-1 text-white" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-blue-500" />
                      <Loader2 size={16} className="animate-spin text-blue-500" />
                      <span className="text-sm text-gray-600">Pratik's assistant is typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about paints, services..."
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-md transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;