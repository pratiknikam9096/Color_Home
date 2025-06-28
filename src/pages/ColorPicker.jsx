import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChromePicker } from 'react-color'
import { useDropzone } from 'react-dropzone'
import { Shuffle, RotateCcw, Heart, Palette, Eye } from 'lucide-react'

function ColorPicker() {
  const [selectedRoom, setSelectedRoom] = useState('livingRoom')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [favoriteColors, setFavoriteColors] = useState([])
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Room configurations with predefined images
  const rooms = {
    livingRoom: {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      description: 'Perfect for relaxation and entertainment'
    },
    kitchen: {
      name: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      description: 'Bright and clean cooking environment'
    },
    bedroom: {
      name: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
      description: 'Peaceful and restful sleeping space'
    },
    bathroom: {
      name: 'Bathroom',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
      description: 'Fresh and clean personal space'
    }
  }

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('favoriteColors')
    if (saved) {
      setFavoriteColors(JSON.parse(saved))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteColors', JSON.stringify(favoriteColors))
  }, [favoriteColors])

  const handleColorChange = (color) => {
    setSelectedColor(color.hex)
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  })

  // Generate random color
  const generateRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setSelectedColor(randomColor)
  }

  // Reset to original room
  const resetRoom = () => {
    setSelectedColor('#ffffff')
    setUploadedImage(null)
  }

  // Add to favorites
  const addToFavorites = () => {
    if (!favoriteColors.some(fav => fav.color === selectedColor)) {
      const newFavorite = {
        id: Date.now(),
        color: selectedColor,
        room: selectedRoom,
        timestamp: new Date().toISOString()
      }
      setFavoriteColors(prev => [newFavorite, ...prev.slice(0, 19)])
    }
  }

  // Remove from favorites
  const removeFromFavorites = (id) => {
    setFavoriteColors(prev => prev.filter(fav => fav.id !== id))
  }

  const currentRoom = rooms[selectedRoom]

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎨 Virtual Paint Tester
          </h1>
          <p className="text-xl text-gray-600">
            See your perfect color before you paint
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Panel - Simple Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            
            {/* Room Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <Eye className="mr-2 text-blue-500" size={20} />
                Choose Room
              </h2>
              <div className="space-y-3">
                {Object.entries(rooms).map(([key, room]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRoom(key)}
                    className={`w-full p-3 rounded-xl transition-all text-left ${
                      selectedRoom === key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="font-semibold">{room.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <Palette className="mr-2 text-purple-500" size={20} />
                Pick Color
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full h-16 rounded-xl border-4 border-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text-white font-bold drop-shadow-lg text-lg">
                    {showColorPicker ? 'Hide Picker' : 'Show Picker'}
                  </span>
                </button>

                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex justify-center"
                    >
                      <ChromePicker
                        color={selectedColor}
                        onChange={handleColorChange}
                        disableAlpha
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={generateRandomColor}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                  >
                    <Shuffle className="mr-2" size={16} />
                    Random
                  </button>
                  <button
                    onClick={resetRoom}
                    className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                  >
                    <RotateCcw className="mr-2" size={16} />
                    Reset
                  </button>
                </div>

                <button
                  onClick={addToFavorites}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                >
                  <Heart className="mr-2" size={16} />
                  Save to Favorites
                </button>
              </div>
            </div>

            {/* Upload Custom Image */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Room</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-600 font-semibold">Drop your image here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 font-semibold mb-1">Drop image here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Large Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {currentRoom.name} Preview
              </h2>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={uploadedImage || currentRoom.image}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover"
                />
                {/* Color Overlay */}
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-50"
                  style={{ backgroundColor: selectedColor }}
                />
                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">{currentRoom.name}</h3>
                    <p className="text-lg opacity-90 mb-3">{currentRoom.description}</p>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full border-3 border-white shadow-lg"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="font-mono text-lg font-bold">{selectedColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Favorites */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <Heart className="mr-2 text-pink-500" size={20} />
                Saved Colors ({favoriteColors.length})
              </h2>
              
              {favoriteColors.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎨</div>
                  <p className="text-gray-500">No saved colors yet</p>
                  <p className="text-sm text-gray-400 mt-1">Save colors you like!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {favoriteColors.map((fav) => (
                    <div key={fav.id} className="relative group">
                      <button
                        onClick={() => setSelectedColor(fav.color)}
                        className="w-full aspect-square rounded-xl border-3 border-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                        style={{ backgroundColor: fav.color }}
                        title={`${fav.color} - ${rooms[fav.room]?.name}`}
                      />
                      <button
                        onClick={() => removeFromFavorites(fav.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl"
            >
              <h3 className="text-lg font-bold mb-2">Love this color?</h3>
              <p className="mb-4 opacity-90">Get expert advice from Pratik</p>
              <div className="space-y-2">
                <a
                  href="tel:9096457620"
                  className="block bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  📞 Call: 9096457620
                </a>
                <a
                  href="https://wa.me/919096457620"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  💬 WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker