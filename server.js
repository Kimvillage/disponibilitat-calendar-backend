import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS config - Permetre Vercel
app.use(cors({
  origin: ['https://disponibilitat-calendar-frontend.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kimvillage:PASSWORD@cluster0.cqdft.mongodb.net/calendari?retryWrites=true&w=majority';

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Calendari de Disponibilitat',
    status: 'running'
  });
});

// ... resta del codi igual ...

