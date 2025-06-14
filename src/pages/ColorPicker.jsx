import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChromePicker } from 'react-color'
import { useDropzone } from 'react-dropzone'

function ColorPicker() {
  const [selectedRoom, setSelectedRoom] = useState('livingRoom')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [uploadedImage, setUploadedImage] = useState(null)

  const rooms = {
    livingRoom: 'Living Room',
    bedroom: 'Bedroom',
    kitchen: 'Kitchen',
    exterior: 'Exterior Walls'
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
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    }
  })

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Virtual Color Picker</h1>
          <p className="text-xl text-gray-600">
            Visualize different colors for your space
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Room</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(rooms).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRoom(key)}
                    className={`p-4 rounded-lg transition-colors ${
                      selectedRoom === key
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Upload Your Image</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag & drop an image or PDF here, or click to select files</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Choose Color</h2>
              <div className="flex justify-center">
                <ChromePicker
                  color={selectedColor}
                  onChange={handleColorChange}
                  disableAlpha
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: selectedColor,
                  backgroundImage: `url(${uploadedImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3'})`,
                  backgroundSize: 'cover',
                  backgroundBlendMode: 'multiply'
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50">
                <p className="text-white text-lg">
                  {rooms[selectedRoom]} - {selectedColor.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Selected Color Details</h3>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p>
                  <strong>Hex Code:</strong> {selectedColor}
                </p>
                <div className="mt-2 h-8 rounded" style={{ backgroundColor: selectedColor }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker