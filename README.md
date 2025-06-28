# Divya Colour Home - Paint Shop Website

A modern, responsive website for Divya Colour Home paint shop featuring AI-powered customer assistance, color picker tools, and comprehensive paint solutions.

## 🎨 Features

- **AI-Powered Chatbot**: Intelligent customer assistance using Google Gemini AI
- **Virtual Color Picker**: Interactive tool for visualizing paint colors
- **Project Gallery**: Showcase of completed painting projects
- **Customer Feedback System**: MongoDB-powered feedback collection
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Contact Integration**: WhatsApp integration for direct communication

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **AI Integration**: Google Gemini AI
- **Maps**: React Leaflet
- **Deployment**: Vercel-ready configuration

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd divya-color-home
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Start the backend server (in a separate terminal):
```bash
npm run server
```

## 🔧 Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini AI API key for the chatbot functionality

### MongoDB Setup

Update the MongoDB connection string in `Backend/server.js` with your database credentials.

## 📱 Features Overview

### AI Chatbot
- Powered by Google Gemini AI
- Context-aware conversations
- Paint-specific knowledge base
- Business information integration

### Color Picker
- Interactive color selection
- Room visualization
- Image upload support
- Color code generation

### Project Gallery
- Filterable project categories
- High-quality project images
- Responsive grid layout

### Feedback System
- Star rating system
- Real-time feedback submission
- MongoDB storage

## 🚀 Deployment

The project is configured for Vercel deployment with the included `vercel.json` configuration.

## 📞 Contact Information

- **Business**: Divya Colour Home
- **Location**: Yakatput Road, Ausa, Latur, Maharashtra 413520
- **Phone**: 9096457620
- **Email**: nikampratik2989@gmail.com

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Security Note

Never commit your API keys or sensitive credentials to the repository. Always use environment variables for sensitive data.