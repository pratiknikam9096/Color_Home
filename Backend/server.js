const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- MongoDB Connection ----------------
const mongoURI = "mongodb+srv://nikampratik2989_db_user:xUoVydVIr83BWXjX@cluster0.pdatrvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let isConnected = false;

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
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

// ---------------- Routes ----------------

// Get feedbacks (most recent first, optional limit)
app.get('/api/feedback', async (req, res) => {
  try {
    await connectDB();
    const limit = parseInt(req.query.limit) || 5;
    const feedbacks = await Feedback.find().sort({ date: -1 }).limit(limit);
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Post new feedback
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
    console.error(err);
    res.status(500).json({ error: 'Server error while saving feedback' });
  }
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
});
