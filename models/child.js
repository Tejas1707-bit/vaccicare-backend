const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  blood: { type: String, default: 'A+' },
  done: { type: Number, default: 0 },
  total: { type: Number, default: 18 }
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);