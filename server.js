const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Booking = require('./models/Booking');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const childrenRoutes = require('./routes/children');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/children', childrenRoutes);

// SMS route
try {
  const smsRoutes = require('./routes/sms');
  app.use('/api/sms', smsRoutes);
  console.log('✅ SMS routes loaded');
} catch (err) {
  console.log('⚠️ SMS routes failed:', err.message);
}

// Email route
try {
  const emailRoutes = require('./routes/email');
  app.use('/api/email', emailRoutes);
  console.log('✅ Email routes loaded');
} catch (err) {
  console.log('⚠️ Email routes failed:', err.message);
}

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch((err) => console.log('❌ MongoDB Error:', err.message));

app.get('/', (req, res) => {
  res.json({ message: '💉 VacciCare Backend is Running!' });
});

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token!' });
    const decoded = jwt.verify(token, 'vaccicare_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token!' });
  }
}

// Create booking
app.post('/api/bookings', authMiddleware, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.userId });
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings for logged in user
app.get('/api/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cancel booking for logged in user
app.put('/api/bookings/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.userId });
    if (!booking) return res.status(404).json({ error: 'Booking not found!' });
    if (booking.status === 'Cancelled') return res.json({ success: false, error: 'Already cancelled!' });
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));