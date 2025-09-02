import { useState } from 'react'
import { motion } from 'framer-motion'

// ✅ Correct image imports
import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'
import img4 from '../assets/4.jpg'
import img5 from '../assets/5.jpg'
import img6 from '../assets/6.jpg'
import img7 from '../assets/7.jpg'
import img8 from '../assets/8.jpg'
import img9 from '../assets/9.jpg'
import img10 from '../assets/10.jpg'

function Projects() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'home', label: 'Home Decor' },
    { id: 'office', label: 'Office Spaces' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'commercial', label: 'Commercial' }
  ]

  const projects = [
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'home',
      client: 'Rohit Verma',
      location: 'Mumbai, MH',
      image: img1,
      description: 'Contemporary design with warm color palette'
    },
    {
      id: 2,
      title: 'Corporate Office',
      category: 'office',
      client: 'Sneha Kulkarni',
      location: 'Pune, MH',
      image: img2,
      description: 'Professional space with elegant finish'
    },
    {
      id: 3,
      title: 'Factory Interior',
      category: 'industrial',
      client: 'Anil Patil',
      location: 'Latur, MH',
      image: img3,
      description: 'Durable industrial coating for high-traffic areas'
    },
    {
      id: 4,
      title: 'Retail Store',
      category: 'commercial',
      client: 'Sunita Deshmukh',
      location: 'Aurangabad, MH',
      image: img4,
      description: 'Vibrant retail environment to attract customers'
    },
    {
      id: 5,
      title: 'Minimalist Bedroom',
      category: 'home',
      client: 'Meera Rathi',
      location: 'Pune, MH',
      image: img5,
      description: 'Simple yet cozy bedroom setup with soft shades'
    },
    {
      id: 6,
      title: 'Executive Office',
      category: 'office',
      client: 'Vikas Jadhav',
      location: 'Mumbai, MH',
      image: img6,
      description: 'Sophisticated executive workspace'
    },
    {
      id: 7,
      title: 'Warehouse Interior',
      category: 'industrial',
      client: 'Sanjay Kulkarni',
      location: 'Latur, MH',
      image: img7,
      description: 'Spacious and organized warehouse facility'
    },
    {
      id: 8,
      title: 'Mall Interior',
      category: 'commercial',
      client: 'Priya Patil',
      location: 'Aurangabad, MH',
      image: img8,
      description: 'Large-scale commercial mall space'
    },
    {
      id: 9,
      title: 'Luxury Living',
      category: 'home',
      client: 'Rohit Verma',
      location: 'Mumbai, MH',
      image: img9,
      description: 'Lavish living room with modern decor'
    },
    {
      id: 10,
      title: 'Startup Office',
      category: 'office',
      client: 'Sneha Kulkarni',
      location: 'Pune, MH',
      image: img10,
      description: 'Creative space designed for startup teams'
    }
  ]

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter)

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Our Projects</h1>
          <p className="text-xl text-gray-600">Explore our completed painting projects</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full transition-colors font-medium ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-sm mb-1">{project.client} • {project.location}</p>
                  <p className="text-sm">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects
