import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flower, Trash2, Filter } from 'lucide-react';

function AnubhavPathri() {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    rating: 5
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load feedbacks from localStorage on component mount
  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('anubhav-feedbacks');
    if (savedFeedbacks) {
      try {
        const parsed = JSON.parse(savedFeedbacks);
        setFeedbacks(parsed);
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        setFeedbacks([]);
      }
    }
  }, []);

  // Save feedbacks to localStorage whenever feedbacks change
  useEffect(() => {
    localStorage.setItem('anubhav-feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('कृपया सर्व फील्ड भरा! (Please fill all fields!)');
      return;
    }

    setIsSubmitting(true);

    // Create new feedback entry
    const newFeedback = {
      id: Date.now(),
      name: formData.name.trim(),
      message: formData.message.trim(),
      rating: formData.rating,
      timestamp: new Date().toISOString(),
      emoji: getRandomEmoji()
    };

    // Add to feedbacks array (newest first)
    setFeedbacks(prev => [newFeedback, ...prev]);

    // Reset form
    setFormData({ name: '', message: '', rating: 5 });
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const getRandomEmoji = () => {
    const emojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🏵️', '🌹', '💐', '🌿', '🍀'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const clearAllFeedbacks = () => {
    setFeedbacks([]);
    setShowClearConfirm(false);
  };

  const filteredFeedbacks = filterRating === 'all' 
    ? feedbacks 
    : feedbacks.filter(fb => fb.rating === parseInt(filterRating));

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Flower className="text-orange-500 mr-2" size={32} />
            <h1 className="text-4xl font-bold text-orange-800">अनुभव पत्री</h1>
            <Flower className="text-orange-500 ml-2" size={32} />
          </div>
          <p className="text-xl text-orange-700 mb-2">नमस्कार! आपला अनुभव आमच्यासोबत शेअर करा</p>
          <p className="text-lg text-gray-600">Namaskar! Share your experience with us</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-100"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-orange-800 mb-2">आपला अनुभव लिहा</h2>
              <p className="text-gray-600">Write Your Experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  नाव / Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="आपले नाव लिहा..."
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  रेटिंग / Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          (hoverRating || formData.rating) >= star 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-orange-700 font-medium">
                    {formData.rating} {formData.rating === 1 ? 'तारा' : 'तारे'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  संदेश / Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="आपला अनुभव आमच्यासोबत शेअर करा..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    सबमिट करत आहे...
                  </span>
                ) : (
                  '🙏 अनुभव शेअर करा / Submit Experience'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Feedbacks Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-orange-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3">
                  <Filter className="text-orange-600" size={20} />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">सर्व रेटिंग / All Ratings</option>
                    <option value="5">5 तारे / 5 Stars</option>
                    <option value="4">4 तारे / 4 Stars</option>
                    <option value="3">3 तारे / 3 Stars</option>
                    <option value="2">2 तारे / 2 Stars</option>
                    <option value="1">1 तारा / 1 Star</option>
                  </select>
                </div>

                {feedbacks.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>सर्व साफ करा / Clear All</span>
                  </button>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                एकूण अनुभव: {feedbacks.length} | दाखवत आहे: {filteredFeedbacks.length}
              </div>
            </div>

            {/* Feedbacks List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredFeedbacks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white rounded-xl shadow-md border-2 border-orange-100"
                  >
                    <Flower className="mx-auto text-orange-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg">
                      {filterRating === 'all' 
                        ? 'अजून कोणताही अनुभव नाही / No experiences yet' 
                        : 'या रेटिंगसाठी अनुभव नाही / No experiences for this rating'
                      }
                    </p>
                  </motion.div>
                ) : (
                  filteredFeedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{feedback.emoji}</span>
                          <div>
                            <h3 className="font-bold text-orange-800 text-lg">{feedback.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= feedback.rating 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatTime(feedback.timestamp)} • {formatDate(feedback.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-red-800 mb-4">खात्री करा / Confirm</h3>
                <p className="text-gray-700 mb-6">
                  तुम्हाला खरोखर सर्व अनुभव साफ करायचे आहेत का? हे कृती पूर्ववत करता येणार नाही.
                  <br /><br />
                  Are you sure you want to clear all experiences? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    रद्द करा / Cancel
                  </button>
                  <button
                    onClick={clearAllFeedbacks}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    साफ करा / Clear All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AnubhavPathri;