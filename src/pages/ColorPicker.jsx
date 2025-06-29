import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChromePicker } from 'react-color'
import { useDropzone } from 'react-dropzone'
import { Shuffle, RotateCcw, Calculator, Eye, Palette, Upload, Ruler, Copy, Check } from 'lucide-react'

function ColorPicker() {
  const [selectedRoom, setSelectedRoom] = useState('livingRoom')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)
  const [colorCopied, setColorCopied] = useState(false)
  
  // Calculator state
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    doors: 1,
    windows: 2,
    coats: 2
  })
  const [calculationResult, setCalculationResult] = useState(null)

  // Room configurations with predefined images
  const rooms = {
    livingRoom: {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      description: 'Perfect for relaxation and entertainment',
      coverage: 120 // sq ft per liter
    },
    kitchen: {
      name: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      description: 'Bright and clean cooking environment',
      coverage: 110 // sq ft per liter (kitchen needs more coverage)
    },
    bedroom: {
      name: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
      description: 'Peaceful and restful sleeping space',
      coverage: 125 // sq ft per liter
    },
    bathroom: {
      name: 'Bathroom',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
      description: 'Fresh and clean personal space',
      coverage: 100 // sq ft per liter (bathroom needs special paint)
    }
  }

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
    setSelectedColor('#3B82F6')
    setUploadedImage(null)
  }

  // Copy color to clipboard
  const copyColorToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedColor)
      setColorCopied(true)
      setTimeout(() => setColorCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
  }

  // Paint Calculator Functions
  const handleDimensionChange = (field, value) => {
    setDimensions(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculatePaint = () => {
    const { length, width, height, doors, windows, coats } = dimensions
    
    if (!length || !width || !height) {
      alert('Please enter all room dimensions')
      return
    }

    // Convert to numbers
    const l = parseFloat(length)
    const w = parseFloat(width)
    const h = parseFloat(height)
    const d = parseInt(doors)
    const win = parseInt(windows)
    const c = parseInt(coats)

    // Calculate wall area
    const wallArea = 2 * (l * h + w * h)
    
    // Subtract door and window areas
    const doorArea = d * 21 // Standard door: 3ft x 7ft = 21 sq ft
    const windowArea = win * 15 // Standard window: 3ft x 5ft = 15 sq ft
    
    const paintableArea = wallArea - doorArea - windowArea
    const totalArea = paintableArea * c // multiply by number of coats
    
    // Get coverage based on room type
    const coverage = rooms[selectedRoom].coverage
    
    // Calculate paint required
    const litersNeeded = Math.ceil(totalArea / coverage)
    const gallonsNeeded = Math.ceil(litersNeeded / 3.78) // 1 gallon = 3.78 liters
    
    // Estimate cost (approximate prices)
    const costPerLiter = selectedRoom === 'bathroom' ? 450 : 350 // Premium for bathroom paint
    const totalCost = litersNeeded * costPerLiter

    setCalculationResult({
      wallArea: Math.round(wallArea),
      paintableArea: Math.round(paintableArea),
      totalArea: Math.round(totalArea),
      litersNeeded,
      gallonsNeeded,
      estimatedCost: totalCost,
      coverage
    })
  }

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
            🎨 Professional Paint Visualizer
          </h1>
          <p className="text-xl text-gray-600">
            Visualize colors on your space and calculate paint requirements
          </p>
        </motion.div>

        {/* Main Layout: Image Preview Left, Controls Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Image Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            
            {/* Room Selection Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex flex-wrap gap-2">
                {Object.entries(rooms).map(([key, room]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRoom(key)}
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      selectedRoom === key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview with Color Overlay */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentRoom.name} Preview
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyColorToClipboard}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {colorCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span className="font-mono">{selectedColor}</span>
                  </button>
                </div>
              </div>
              
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-4">
                <img
                  src={uploadedImage || currentRoom.image}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover"
                />
                {/* Enhanced Color Overlay with Blend Mode */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-multiply"
                  style={{ backgroundColor: selectedColor }}
                />
                {/* Gradient Overlay for Better Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">{currentRoom.name}</h3>
                    <p className="text-sm opacity-90 mb-2">{currentRoom.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="font-mono text-sm font-bold">{selectedColor.toUpperCase()}</span>
                      </div>
                      <div className="text-xs opacity-80">
                        Coverage: {currentRoom.coverage} sq ft/L
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Information Panel */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white shadow-lg"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div className="font-mono text-sm font-bold text-gray-800">{selectedColor.toUpperCase()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">RGB Values</div>
                    <div className="font-mono text-sm text-gray-800">
                      {parseInt(selectedColor.slice(1, 3), 16)}, {parseInt(selectedColor.slice(3, 5), 16)}, {parseInt(selectedColor.slice(5, 7), 16)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">HSL Values</div>
                    <div className="font-mono text-sm text-gray-800">
                      {/* Convert hex to HSL for display */}
                      HSL Values
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Custom Image */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <Upload className="mr-2 text-green-500" size={18} />
                Upload Your Own Room Image
              </h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 text-gray-400" size={32} />
                {isDragActive ? (
                  <p className="text-blue-600">Drop your image here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drag & drop an image here, or click to select</p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, WebP (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Color Selection & Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            
            {/* Color Picker Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <Palette className="mr-2 text-purple-500" size={18} />
                Choose Color
              </h2>
              
              <div className="space-y-4">
                {/* Current Color Display */}
                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-xl mx-auto mb-3 border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: selectedColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  <div className="font-mono text-lg font-bold text-gray-800">{selectedColor.toUpperCase()}</div>
                </div>

                {/* Color Picker */}
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
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={generateRandomColor}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center transition-all"
                  >
                    <Shuffle className="mr-1" size={14} />
                    Random
                  </button>
                  <button
                    onClick={resetRoom}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center transition-all"
                  >
                    <RotateCcw className="mr-1" size={14} />
                    Reset
                  </button>
                </div>

                {/* Toggle Color Picker Button */}
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  {showColorPicker ? 'Hide Color Picker' : 'Show Color Picker'}
                </button>
              </div>
            </div>

            {/* Paint Calculator Toggle */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="w-full flex items-center justify-between text-lg font-bold text-gray-800 mb-4"
              >
                <div className="flex items-center">
                  <Calculator className="mr-2 text-orange-500" size={18} />
                  Paint Calculator
                </div>
                <motion.div
                  animate={{ rotate: showCalculator ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▼
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showCalculator && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Room Dimensions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Ruler className="inline mr-1" size={14} />
                        Room Dimensions (feet)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Length"
                          value={dimensions.length}
                          onChange={(e) => handleDimensionChange('length', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Width"
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Height"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Doors and Windows */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
                        <select
                          value={dimensions.doors}
                          onChange={(e) => handleDimensionChange('doors', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[0,1,2,3,4].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Windows</label>
                        <select
                          value={dimensions.windows}
                          onChange={(e) => handleDimensionChange('windows', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[0,1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Number of Coats */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coats</label>
                      <select
                        value={dimensions.coats}
                        onChange={(e) => handleDimensionChange('coats', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>1 Coat</option>
                        <option value={2}>2 Coats (Recommended)</option>
                        <option value={3}>3 Coats</option>
                      </select>
                    </div>

                    {/* Calculate Button */}
                    <button
                      onClick={calculatePaint}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Calculate Paint Required
                    </button>

                    {/* Results */}
                    {calculationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
                      >
                        <h3 className="font-bold text-green-800 mb-3">📊 Calculation Results</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wall Area:</span>
                            <span className="font-semibold">{calculationResult.wallArea} sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Paintable Area:</span>
                            <span className="font-semibold">{calculationResult.paintableArea} sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Area ({dimensions.coats} coats):</span>
                            <span className="font-semibold">{calculationResult.totalArea} sq ft</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-800 font-semibold">Paint Needed:</span>
                            <span className="font-bold text-blue-600">{calculationResult.litersNeeded}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">In Gallons:</span>
                            <span className="font-semibold">{calculationResult.gallonsNeeded} gal</span>
                          </div>
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-800 font-semibold">Estimated Cost:</span>
                            <span className="font-bold text-green-600">₹{calculationResult.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-800">
                            💡 <strong>Tip:</strong> Add 10-15% extra paint for touch-ups and future maintenance.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
              <h4 className="text-lg font-bold mb-2">Need Expert Advice?</h4>
              <p className="mb-4 text-sm opacity-90">Contact Pratik for professional color consultation</p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:9096457620"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                  📞 Call: 9096457620
                </a>
                <a
                  href="https://wa.me/919096457620"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker