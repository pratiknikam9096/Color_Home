import { motion } from 'framer-motion'

function About() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About Divya Colour Home</h1>
          <p className="text-xl text-gray-600">Your trusted partner in paint solutions since 2020</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide high-quality paint solutions that transform spaces and bring colors to life, 
              while ensuring customer satisfaction through excellent service and expert guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the leading paint solution provider in Latur region, known for our quality products, 
              innovative color solutions, and exceptional customer service.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Paint Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Interior Paints',
                items: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom']
              },
              {
                title: 'Exterior Paints',
                items: ['Walls', 'Fences', 'Roof', 'Weather Coating']
              },
              {
                title: 'Texture Finishes',
                items: ['Metallic', 'Stone', 'Wood', 'Designer']
              },
              {
                title: 'Metal & Wood',
                items: ['Metal Primers', 'Wood Varnish', 'Enamel', 'Lacquer']
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-gray-600">• {item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <a
            href="https://maps.app.goo.gl/tY896kkYeoKJzoqw9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Visit Our Paint Shop
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default About