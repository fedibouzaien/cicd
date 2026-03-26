const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'client') matchQuery.sender = req.user._id;
    else if (req.user.role === 'courier') matchQuery.courier = req.user._id;

    const [total, pending, in_transit, delivered, failed, totalUsers] = await Promise.all([
      Parcel.countDocuments(matchQuery),
      Parcel.countDocuments({ ...matchQuery, status: 'pending' }),
      Parcel.countDocuments({ ...matchQuery, status: { $in: ['picked_up', 'in_transit', 'out_for_delivery'] } }),
      Parcel.countDocuments({ ...matchQuery, status: 'delivered' }),
      Parcel.countDocuments({ ...matchQuery, status: { $in: ['failed', 'returned'] } }),
      req.user.role === 'admin' ? User.countDocuments() : Promise.resolve(0)
    ]);

    const recentParcels = await Parcel.find(matchQuery)
      .populate('sender', 'name')
      .populate('courier', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ total, pending, in_transit, delivered, failed, totalUsers, recentParcels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
