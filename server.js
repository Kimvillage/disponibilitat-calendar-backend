import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'Disponibilitat Calendar API is running' });
});

mongoose.connect(process.env.MONGODB_URI);

const CalendarSchema = new mongoose.Schema({
  dates: {
    type: Map,
    of: {
      status: {
        type: String,
        enum: ['none', 'morning', 'afternoon', 'full_day', 'bolo'],
        default: 'none'
      }
    }
  }
});

const Calendar = mongoose.model('Calendar', CalendarSchema);

app.get('/api/calendar', async (req, res) => {
  try {
    let calendar = await Calendar.findOne();
    if (!calendar) {
      calendar = await Calendar.create({ dates: {} });
    }
    res.json(calendar.dates.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Error getting calendar data' });
  }
});

app.post('/api/calendar', async (req, res) => {
  try {
    let calendar = await Calendar.findOne();
    if (!calendar) {
      calendar = await Calendar.create({ dates: req.body });
    } else {
      calendar.dates = req.body;
      await calendar.save();
    }
    res.status(200).json({ message: 'Calendar updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating calendar data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});