import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

function Feedbackreceive() {
  const API_BASE_URL =  'http://localhost:5001';

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Sample feedback data for visual preview
  const sampleFeedbacks = [
    {
      id: 1,
      name: "राहुल शर्मा",
      rating: 5,
      comment: "Divya Colour Home ने माझ्या घराचे रंगकाम अप्रतिम केले आहे! प्रतिकजी खूप चांगले सल्ला देतात आणि quality खूप चांगली आहे. Highly recommended!",
      date: new Date('2024-01-15'),
      avatar: "🏠"
    },
    {
      id: 2,
      name: "Priya Patil",
      rating: 5,
      comment: "Amazing service! Pratik bhai helped us choose perfect colors for our new home. The paint quality is excellent and the finish is beautiful. Very satisfied with the work!",
      date: new Date('2024-01-12'),
      avatar: "🎨"
    },
    {
      id: 3,
      name: "संजय कुलकर्णी",
      rating: 4,
      comment: "Good quality paints and reasonable prices. Pratik sir is very knowledgeable about different paint types. Will definitely come back for future projects.",
      date: new Date('2024-01-10'),
      avatar: "👨‍🔧"
    },
    {
      id: 4,
      name: "Anita Deshmukh",
      rating: 5,
      comment: "Excellent customer service! They helped me select waterproof paint for bathroom and kitchen. The colors are vibrant and long-lasting. Thank you Divya Colour Home!",
      date: new Date('2024-01-08'),
      avatar: "🌈"
    },
    {
      id: 5,
      name: "विकास जाधव",
      rating: 5,
      comment: "Best paint shop in Ausa! Pratik bhai gave us great advice for exterior painting. The weather-resistant paint is working perfectly even after monsoon. Highly recommended!",
      date: new Date('2024-01-05'),
      avatar: "🏡"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Submission failed');

      setMessage('Feedback submitted successfully!');
      setFormData({ name: '', rating: 5, comment: '' });
    } catch (err) {
      setMessage('Error submitting feedback');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Customer Feedback</h1>
          <p className="text-xl text-gray-600">Share your experience with Divya Colour Home</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Feedback Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Share Your Feedback
              </motion.h2>
              <p className="text-gray-600">We value your opinion and would love to hear from you!</p>
            </div>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 mb-6 rounded-lg ${
                    message.includes('Error') 
                      ? 'bg-red-50 text-red-800 border border-red-200' 
                      : 'bg-green-50 text-green-800 border border-green-200'
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      {(hoverRating || formData.rating) >= star ? (
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <Star className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                  <span className="ml-3 text-gray-600 font-medium">
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Customer Feedback Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🌟 Recent Customer Reviews
              </h3>
              <p className="text-center text-gray-600 mb-6">
                See what our customers are saying about Divya Colour Home
              </p>
            </div>

            {/* Feedback Cards */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sampleFeedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{feedback.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">{feedback.name}</h4>
                        <span className="text-sm text-gray-500">{formatDate(feedback.date)}</span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= feedback.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center"
            >
              <h4 className="text-xl font-bold mb-2">Ready to Transform Your Space?</h4>
              <p className="mb-4">Contact Pratik for expert paint consultation</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:9096457620"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  📞 Call: 9096457620
                </a>
                <a
                  href="https://wa.me/919096457620"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  💬 WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Feedbackreceive;