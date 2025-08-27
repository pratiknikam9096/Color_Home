import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('/api/feedback?limit=5', {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      setError(err.message.includes('aborted')
        ? 'Request timed out. Check your connection.'
        : `Failed to load feedback: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 rounded-lg text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Feedback</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchFeedbacks}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Ensure your backend server is running on port 5001
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-800">What Our Users Say</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {feedbacks.map((fb, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">{fb.name}</h3>

            <div className="flex gap-1 text-yellow-500 my-1">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>

            <p className="text-gray-700 text-sm mb-3">"{fb.comment}"</p>
            <p className="text-xs text-gray-400">{new Date(fb.date).toLocaleDateString('en-IN')}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;