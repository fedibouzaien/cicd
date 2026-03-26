const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel');
const { protect } = require('../middleware/auth');

// Get all parcels
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') query.sender = req.user._id;
    else if (req.user.role === 'courier') query.courier = req.user._id;
    
    const { status, search } = req.query;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { 'recipient.name': { $regex: search, $options: 'i' } },
        { 'recipient.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    const parcels = await Parcel.find(query)
      .populate('sender', 'name email phone')
      .populate('courier', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single parcel
router.get('/:id', protect, async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('sender', 'name email phone')
      .populate('courier', 'name email phone');
    if (!parcel) return res.status(404).json({ message: 'Colis non trouvé' });
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track by tracking number (public)
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ trackingNumber: req.params.trackingNumber })
      .populate('courier', 'name phone');
    if (!parcel) return res.status(404).json({ message: 'Numéro de suivi invalide' });
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create parcel
router.post('/', protect, async (req, res) => {
  try {
    const parcel = await Parcel.create({ ...req.body, sender: req.user._id });
    res.status(201).json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update parcel
router.put('/:id', protect, async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: 'Colis non trouvé' });
    
    // Add tracking event if status changed
    if (req.body.status && req.body.status !== parcel.status) {
      parcel.trackingHistory.push({
        status: req.body.status,
        location: req.body.location || 'Non spécifié',
        description: req.body.statusDescription || `Statut mis à jour: ${req.body.status}`
      });
    }
    
    Object.assign(parcel, req.body);
    const updated = await parcel.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete parcel
router.delete('/:id', protect, async (req, res) => {
  try {
    await Parcel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Colis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign courier
router.patch('/:id/assign', protect, async (req, res) => {
  try {
    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { courier: req.body.courierId, status: 'picked_up' },
      { new: true }
    ).populate('courier', 'name email phone');
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
