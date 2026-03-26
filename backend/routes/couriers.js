const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get all couriers
router.get('/', protect, async (req, res) => {
  try {
    const couriers = await User.find({ role: 'courier' }).select('-password');
    res.json(couriers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
