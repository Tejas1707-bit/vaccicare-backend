const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Booking = require('./models/Booking');
const authRoutes = require('./routes/auth');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch((err) => console.log('❌ MongoDB Error:', err.message));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '💉 VacciCare Backend is Running!' });
});

// Save booking
app.post('/api/bookings', async (req, res) => {
  try {
    console.log('Received booking:', req.body);
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.log('Booking error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));