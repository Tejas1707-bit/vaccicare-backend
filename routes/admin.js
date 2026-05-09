const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Middleware to check admin
function isAdmin(req, res, next) {
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

// Get dashboard stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'parent' });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: todayStart } });
    res.json({ totalUsers, totalBookings, confirmedBookings, todayBookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status
router.put('/bookings/:id', isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'parent' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;