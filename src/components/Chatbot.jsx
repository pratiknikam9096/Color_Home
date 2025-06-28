import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles, Palette, Home, Phone } from 'lucide-react';
import geminiService from '../services/geminiService';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🎨 Hello! I'm Pratik's AI assistant at Divya Colour Home. I'm powered by advanced AI to help you with:\n\n• Smart paint recommendations\n• Color combinations & trends\n• Technical paint advice\n• Service bookings\n• Custom solutions\n\nWhat paint challenge can I solve for you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationCount, setConversationCount] = useState(0);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "🏠 Best paint for my living room",
    "💧 Waterproof bathroom paints",
    "🎨 Trending color combinations",
    "📅 Book color consultation",
    "🔧 Paint coverage calculator",
    "☎️ Contact Pratik directly"
  ];

  const quickActions = [
    { icon: Home, text: "Room Paint Guide", action: "room-guide" },
    { icon: Palette, text: "Color Trends 2025", action: "color-trends" },
    { icon: Phone, text: "Call Pratik", action: "contact" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI response using Gemini
  const generateBotResponse = async (userMessage) => {
    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(1); // Exclude initial greeting
      
      // Use Gemini AI for intelligent responses
      const response = await geminiService.generateResponse(userMessage, conversationHistory);
      
      // Add some personality and formatting
      let enhancedResponse = response;
      
      // Add emojis and formatting for better UX
      if (userMessage.toLowerCase().includes('thank')) {
        enhancedResponse += "\n\n😊 Happy to help! Feel free to ask anything else about paints or colors.";
      }
      
      // Encourage action for service-related queries
      if (userMessage.toLowerCase().includes('book') || userMessage.toLowerCase().includes('consultation')) {
        enhancedResponse += "\n\n📞 Ready to book? Call Pratik at 9096457620 or I can help you prepare for the consultation!";
      }
      
      return enhancedResponse;
    } catch (error) {
      console.error('AI Response Error:', error);
      return "I'm having trouble accessing my AI capabilities right now. For immediate assistance with your paint needs, please call Pratik at 9096457620. He's always ready to help with expert advice!";
    }
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
    setConversationCount(prev => prev + 1);

    try {
      // Realistic AI thinking time
      const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
      
      const botResponse = await new Promise(async (resolve) => {
        setTimeout(async () => {
          const response = await generateBotResponse(messageText);
          resolve(response);
        }, thinkingTime);
      });

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm experiencing technical difficulties. Please contact Pratik directly at 9096457620 for immediate assistance with your paint needs.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'room-guide':
        handleSendMessage("Can you provide a comprehensive guide for choosing paints for different rooms in my house?");
        break;
      case 'color-trends':
        handleSendMessage("What are the trending paint colors and combinations for 2025?");
        break;
      case 'contact':
        window.open('tel:9096457620', '_self');
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Remove emoji from suggestion for cleaner message
    const cleanSuggestion = suggestion.replace(/[🏠💧🎨📅🔧☎️]/g, '').trim();
    handleSendMessage(cleanSuggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        } text-white relative overflow-hidden`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Sparkle effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, white 2px, transparent 2px)',
              'radial-gradient(circle at 80% 50%, white 2px, transparent 2px)',
              'radial-gradient(circle at 50% 20%, white 2px, transparent 2px)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        
        {/* AI Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={12} />
          </motion.div>
        )}
      </motion.button>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white p-4 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    'linear-gradient(45deg, transparent 60%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-yellow-300" size={20} />
                  <h3 className="font-bold">AI Paint Assistant</h3>
                </div>
                <p className="text-sm opacity-90">Powered by Google Gemini AI</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Online & Ready to Help</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {showSuggestions && (
              <div className="p-3 bg-gray-50 border-b">
                <div className="flex space-x-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center space-x-1 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-xs"
                    >
                      <action.icon size={14} className="text-blue-500" />
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow-md border border-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      {message.sender === 'user' && (
                        <User size={16} className="mt-1 text-white opacity-80" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Suggestions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-gray-500 text-center font-medium">✨ Try these AI-powered suggestions:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left text-sm p-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-100 hover:border-blue-200"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about paints..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all shadow-md"
                >
                  <Send size={18} />
                </motion.button>
              </div>
              
              {/* Conversation counter */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>💬 {conversationCount} messages exchanged</span>
                <span>🤖 Powered by Gemini AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;