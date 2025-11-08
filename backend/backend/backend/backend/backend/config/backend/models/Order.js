const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    customizations: String
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  deliveryAddress: { street: String, city: String, state: String, zipCode: String, coordinates: { lat: Number, lng: Number } },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  review: String
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ partner: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
