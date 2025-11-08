const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false },
  businessType: { type: String, enum: ['Restaurant', 'Cloud Kitchen', 'Cafe', 'Bakery'], required: true },
  cuisine: [String],
  address: { street: String, city: String, state: String, zipCode: String, coordinates: { lat: Number, lng: Number } },
  openingHours: { open: String, close: String },
  isActive: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rating: { average: { type: Number, default: 0, min: 0, max: 5 }, count: { type: Number, default: 0 } },
  bankDetails: { accountNumber: String, ifscCode: String, accountHolderName: String },
  documents: { fssai: String, gst: String, pan: String },
  commission: { type: Number, default: 20 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 }
}, { timestamps: true });

partnerSchema.index({ email: 1 });
partnerSchema.index({ isActive: 1, rating: -1 });

module.exports = mongoose.model('Partner', partnerSchema);
