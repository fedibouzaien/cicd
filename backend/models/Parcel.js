const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
  status: String,
  location: String,
  description: String,
  timestamp: { type: Date, default: Date.now }
});

const parcelSchema = new mongoose.Schema({
  trackingNumber: { type: String, unique: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: {
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: { type: String, required: true },
    city: String
  },
  courier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  description: String,
  weight: Number,
  dimensions: { length: Number, width: Number, height: Number },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'pending'
  },
  priority: { type: String, enum: ['standard', 'express', 'urgent'], default: 'standard' },
  price: Number,
  estimatedDelivery: Date,
  trackingHistory: [trackingEventSchema],
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate tracking number
parcelSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Parcel', parcelSchema);
