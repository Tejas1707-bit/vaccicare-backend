 const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  age: { type: String, required: true },
  vaccine: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  clinic: { type: String, required: true },
  contact: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
