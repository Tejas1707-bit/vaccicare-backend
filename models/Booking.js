const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  childName: String,
  age: String,
  vaccine: String,
  date: String,
  time: String,
  clinic: String,
  contact: String,
  notes: String,
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);