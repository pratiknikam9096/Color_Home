const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());

// Replace myDatabaseName with your actual DB name if you want, or leave it empty to use default
const mongoURI = "mongodb+srv://nikampratik2989:DhSr2nePHaA8Znkt@cluster0.m8wc0ad.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=Cluster0";

let isConnected = false;

const feedbackSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  }
}

// Routes
app.get('/api/feedback', async (req, res) => {
  try {
    await connectDB();
    const limit = parseInt(req.query.limit) || 5;
    const feedbacks = await Feedback.find().sort({ date: -1 }).limit(limit);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    await connectDB();
    const { name, rating, comment } = req.body;

    if (!name || rating == null || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newFeedback = new Feedback({ name, rating, comment });
    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving feedback' });
  }
});

// Start server after DB connection
async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
module.exports.handler = serverless(app);
