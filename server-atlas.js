import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB Atlas connection - Substitueix PASSWORD per la teva contrasenya real
const MONGODB_URI = 'mongodb+srv://kimvillage:quim@cluster0.cqdft.mongodb.net/calendari?retryWrites=true&w=majority&appName=Cluster0';

try {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas successfully');
} catch (error) {
  console.error('MongoDB connection error details:', {
    message: error.message,
    code: error.code
  });
}

// Define Calendar Schema
const calendarSchema = new mongoose.Schema({
  date: String,
  status: {
    type: String,
    enum: ['none', 'morning', 'afternoon', 'full_day', 'bolo'],
    default: 'none'
  }
}, { timestamps: true });

const Calendar = mongoose.model('Calendar', calendarSchema);

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'El servidor funciona correctament!',
    mongodb: mongoose.connection.readyState === 1 ? 'connectat' : 'desconnectat'
  });
});

// Get calendar data
app.get('/api/calendar', async (req, res) => {
  try {
    const entries = await Calendar.find({});
    const calendarData = entries.reduce((acc, entry) => {
      acc[entry.date] = { status: entry.status };
      return acc;
    }, {});
    res.json(calendarData);
  } catch (error) {
    console.error('Error reading calendar:', error);
    res.status(500).json({ error: 'Error reading calendar data', details: error.message });
  }
});

// Save calendar data
app.post('/api/calendar', async (req, res) => {
  try {
    // Delete all existing entries
    await Calendar.deleteMany({});
    
    // Create new entries from the request body
    const entries = Object.entries(req.body).map(([date, data]) => ({
      date,
      status: data.status
    }));
    
    if (entries.length > 0) {
      await Calendar.insertMany(entries);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving calendar:', error);
    res.status(500).json({ error: 'Error saving calendar data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/test`);
  console.log(`MongoDB connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
});
