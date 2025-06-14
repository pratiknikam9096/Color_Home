import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import video from '../assets/v1.mp4';

function Home() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 150000);
    return () => clearTimeout(timer);
  }, []);

  // Main services except the new one
  const mainServices = [
    { title: 'Interior Paints', icon: '🏠', link: '/Projects' },
    { title: 'Exterior Paints', icon: '🏢', link: '/Projects' },
    { title: 'Texture Finishes', icon: '🎨', link: '/Projects' },
  ];

  // New "Paint for Sell" service
  const specialService = { title: 'Paint for Sell', icon: '🖌️', link: '/Projects' };

  return (
    <div className="min-h-screen relative">
      {/* 🔹 Corner Video Ad */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 z-40 w-[280px] rounded-xl shadow-lg bg-white overflow-hidden">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-1 right-1 z-50 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
          >
            ✕
          </button>
          <video
            src={video}
            autoPlay
            muted
            controls
            className="w-full h-[160px] object-cover"
          />
        </div>
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[80vh] bg-gradient-to-r from-primary-500 to-secondary-500"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              Bringing Colors to Life
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8"
            >
              Transform your space with our premium paint solutions
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-x-4"
            >
              <Link
                to="/about"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
              >
                Explore Our Range
              </Link>
              <Link
                to="/contact"
                className="bg-white hover:bg-gray-100 text-primary-600 px-6 py-3 rounded-lg inline-block transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>

          {/* Grid for main services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <Link
                  to={service.link}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Special service pinned below */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center"
          >
            <div className="text-5xl mb-6">{specialService.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{specialService.title}</h3>
            <Link
              to={specialService.link}
              className="text-primary-700 font-semibold hover:text-primary-900"
            >
              Learn More →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
