import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

// ---------------- Types ----------------
interface Feedback {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: Date;
  avatar: string;
}

interface FormData {
  name: string;
  rating: number;
  comment: string;
}

// ---------------- Feedback Card ----------------
function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl">{feedback.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-800 text-lg">{feedback.name}</h4>
            <span className="text-sm text-gray-500">
              {new Date(feedback.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= feedback.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
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
  );
}

// ---------------- Feedback List ----------------
function FeedbackList({ feedbacks }: { feedbacks: Feedback[] }) {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {feedbacks.map((fb, index) => (
        <motion.div key={fb.id} transition={{ delay: index * 0.1 }}>
          <FeedbackCard feedback={fb} />
        </motion.div>
      ))}
    </div>
  );
}

// ---------------- Feedback Form ----------------
function FeedbackForm({
  onSubmit,
  isSubmitting,
  message,
  formData,
  setFormData,
}: {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  message: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
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
        <p className="text-gray-600">
          We value your opinion and would love to hear from you!
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 mb-6 rounded-lg ${
              message.includes("Error")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Your name"
          />
        </div>

        {/* Rating */}
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
              {formData.rating} {formData.rating === 1 ? "Star" : "Stars"}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Comments</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            minLength={10}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="Tell us about your experience..."
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </motion.button>
      </form>
    </motion.div>
  );
}

// ---------------- Main Component ----------------
export default function FeedbackReceive() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // ---------------- Sample Real Feedbacks ----------------
  const sampleFeedbacks: Feedback[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      comment:
        "Divya Colour Home did an amazing job painting our house! Pratik sir gives excellent advice and the quality is outstanding. Highly recommended!",
      date: new Date("2024-01-15"),
      avatar: "🏠",
    },
    {
      id: 2,
      name: "Priya Patil",
      rating: 5,
      comment:
        "Amazing service! Pratik bhai helped us choose perfect colors for our new home. The paint quality is excellent and the finish is beautiful.",
      date: new Date("2024-01-12"),
      avatar: "🎨",
    },
    {
      id: 3,
      name: "Sanjay Kulkarni",
      rating: 4,
      comment:
        "Good quality paints and reasonable prices. Pratik sir is very knowledgeable about different paint types. Will definitely come back.",
      date: new Date("2024-01-10"),
      avatar: "👨‍🔧",
    },
    {
      id: 4,
      name: "Anita Deshmukh",
      rating: 5,
      comment:
        "Excellent customer service! They helped me select waterproof paint for bathroom and kitchen. The colors are vibrant and long-lasting.",
      date: new Date("2024-01-08"),
      avatar: "🌈",
    },
    {
      id: 5,
      name: "Vikas Jadhav",
      rating: 5,
      comment:
        "Best paint shop in Ausa! Pratik bhai gave us great advice for exterior painting. The weather-resistant paint is working perfectly even after monsoon.",
      date: new Date("2024-01-05"),
      avatar: "🏡",
    },
    {
      id: 6,
      name: "Meena Rathi",
      rating: 4,
      comment:
        "Very professional service. They explained the difference between paints clearly and suggested the right shades for my living room. Happy with results!",
      date: new Date("2024-01-03"),
      avatar: "🛋️",
    },
  ];

  // ---------------- Handle Submit ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Mock API Call
      await new Promise((res) => setTimeout(res, 1500));

      setMessage("Feedback submitted successfully!");
      setFormData({ name: "", rating: 5, comment: "" });
    } catch (err) {
      setMessage("Error submitting feedback");
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Customer Feedback
          </h1>
          <p className="text-xl text-gray-600">
            Share your experience with Divya Colour Home
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <FeedbackForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            message={message}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Feedback Section */}
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

            <FeedbackList feedbacks={sampleFeedbacks} />

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center"
            >
              <h4 className="text-xl font-bold mb-2">
                Ready to Transform Your Space?
              </h4>
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
