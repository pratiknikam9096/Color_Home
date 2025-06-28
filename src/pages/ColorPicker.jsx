import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChromePicker } from 'react-color'
import { useDropzone } from 'react-dropzone'
import { Shuffle, RotateCcw, Heart, Save, Palette, Eye, Download } from 'lucide-react'

function ColorPicker() {
  const [selectedRoom, setSelectedRoom] = useState('livingRoom')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [favoriteColors, setFavoriteColors] = useState([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorHistory, setColorHistory] = useState(['#ffffff'])

  // Room configurations with predefined images and characteristics
  const rooms = {
    livingRoom: {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      description: 'Perfect for relaxation and entertainment',
      suggestedColors: ['#F5F5DC', '#E6E6FA', '#F0F8FF', '#FFF8DC'],
      characteristics: 'Warm, welcoming, social space'
    },
    kitchen: {
      name: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      description: 'Bright and clean cooking environment',
      suggestedColors: ['#FFFACD', '#F0FFFF', '#F5FFFA', '#FDF5E6'],
      characteristics: 'Clean, bright, energizing'
    },
    bedroom: {
      name: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
      description: 'Peaceful and restful sleeping space',
      suggestedColors: ['#E6E6FA', '#F0F8FF', '#FFF0F5', '#F8F8FF'],
      characteristics: 'Calm, peaceful, restful'
    },
    bathroom: {
      name: 'Bathroom',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
      description: 'Fresh and clean personal space',
      suggestedColors: ['#F0FFFF', '#E0FFFF', '#F5FFFA', '#FFFAFA'],
      characteristics: 'Fresh, clean, spa-like'
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
    // Add to history if it's a new color
    if (!colorHistory.includes(color.hex)) {
      setColorHistory(prev => [color.hex, ...prev.slice(0, 9)]) // Keep last 10 colors
    }
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
    if (!colorHistory.includes(randomColor)) {
      setColorHistory(prev => [randomColor, ...prev.slice(0, 9)])
    }
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
      setFavoriteColors(prev => [newFavorite, ...prev.slice(0, 19)]) // Keep last 20
    }
  }

  // Remove from favorites
  const removeFromFavorites = (id) => {
    setFavoriteColors(prev => prev.filter(fav => fav.id !== id))
  }

  // Get color suggestions based on selected color
  const getColorSuggestions = (baseColor) => {
    // Simple color theory implementation
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    // Generate complementary color
    const compR = 255 - r
    const compG = 255 - g
    const compB = 255 - b
    const complementary = `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`

    // Generate analogous colors
    const analogous1 = `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`
    const analogous2 = `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

    return {
      complementary,
      analogous: [analogous1, analogous2],
      triadic: [`#${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${r.toString(16).padStart(2, '0')}`, `#${b.toString(16).padStart(2, '0')}${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}`]
    }
  }

  // Get room usage suggestions
  const getRoomSuggestions = (color) => {
    const suggestions = {
      light: "Perfect for small spaces, creates an airy feel, great for bedrooms and bathrooms",
      warm: "Ideal for living rooms and dining areas, creates cozy atmosphere",
      cool: "Excellent for kitchens and offices, promotes focus and cleanliness",
      bold: "Great for accent walls, creative spaces, and modern interiors",
      neutral: "Versatile for any room, timeless appeal, easy to decorate around"
    }

    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    if (brightness > 200) return suggestions.light
    if (r > g && r > b) return suggestions.warm
    if (b > r && b > g) return suggestions.cool
    if (brightness < 100) return suggestions.bold
    return suggestions.neutral
  }

  const colorSuggestions = getColorSuggestions(selectedColor)
  const currentRoom = rooms[selectedRoom]

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎨 Real-Time Interior Color Testing
          </h1>
          <p className="text-xl text-gray-600">
            Visualize your perfect paint color before you buy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Room Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Eye className="mr-2 text-blue-500" />
                Select Room
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(rooms).map(([key, room]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRoom(key)}
                    className={`p-4 rounded-xl transition-all text-left ${
                      selectedRoom === key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold">{room.name}</div>
                    <div className="text-sm opacity-80">{room.characteristics}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Palette className="mr-2 text-purple-500" />
                Choose Color
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text-white font-semibold drop-shadow-lg">
                    Click to {showColorPicker ? 'Hide' : 'Show'} Color Picker
                  </span>
                </button>

                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
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

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={generateRandomColor}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <Shuffle className="mr-2" size={16} />
                    Random
                  </button>
                  <button
                    onClick={resetRoom}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <RotateCcw className="mr-2" size={16} />
                    Reset
                  </button>
                  <button
                    onClick={addToFavorites}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <Heart className="mr-2" size={16} />
                    Save
                  </button>
                </div>

                {/* Color History */}
                {colorHistory.length > 1 && (
                  <div>
                    <h3 className="font-semibold mb-2">Recent Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {colorHistory.slice(0, 8).map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Custom Image */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Download className="mr-2 text-green-500" />
                Upload Your Room
              </h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-600">Drop your room image here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drag & drop a room image</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {currentRoom.name} Preview
            </h2>
            
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-4">
              <img
                src={uploadedImage || currentRoom.image}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
              {/* Color Overlay */}
              <div
                className="absolute inset-0 mix-blend-multiply opacity-60"
                style={{ backgroundColor: selectedColor }}
              />
              {/* Gradient Overlay for better text visibility */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{currentRoom.name}</h3>
                  <p className="text-sm opacity-90">{currentRoom.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="font-mono text-sm">{selectedColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Suggestions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">💡 Color Recommendation</h3>
              <p className="text-sm text-gray-700">{getRoomSuggestions(selectedColor)}</p>
            </div>
          </motion.div>

          {/* Right Panel - Color Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Color Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">Color Details</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="font-mono text-lg font-bold">{selectedColor.toUpperCase()}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-600">HEX</div>
                    <div className="font-mono">{selectedColor}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-600">RGB</div>
                    <div className="font-mono">
                      {parseInt(selectedColor.slice(1, 3), 16)}, {parseInt(selectedColor.slice(3, 5), 16)}, {parseInt(selectedColor.slice(5, 7), 16)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Combinations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">Color Combinations</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Complementary</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedColor(colorSuggestions.complementary)}
                      className="w-12 h-12 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                      style={{ backgroundColor: colorSuggestions.complementary }}
                      title={colorSuggestions.complementary}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Analogous</h3>
                  <div className="flex space-x-2">
                    {colorSuggestions.analogous.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Room Suggestions</h3>
                  <div className="flex space-x-2">
                    {currentRoom.suggestedColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Colors */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="mr-2 text-pink-500" />
                Saved Colors ({favoriteColors.length})
              </h2>
              {favoriteColors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No saved colors yet</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {favoriteColors.map((fav) => (
                    <div key={fav.id} className="relative group">
                      <button
                        onClick={() => setSelectedColor(fav.color)}
                        className="w-full aspect-square rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: fav.color }}
                        title={`${fav.color} - ${rooms[fav.room]?.name}`}
                      />
                      <button
                        onClick={() => removeFromFavorites(fav.id)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker