const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Child = require('../models/Child');

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

// Get all children for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const children = await Child.find({ userId: req.userId });
    res.json({ success: true, children });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a child
router.post('/', authMiddleware, async (req, res) => {
  try {
    const child = new Child({ ...req.body, userId: req.userId });
    await child.save();
    res.json({ success: true, child });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a child
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Child.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;