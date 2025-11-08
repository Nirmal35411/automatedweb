const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Order Payment', 'Refund', 'Partner Payout'], required: true },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['COD', 'Online'] },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  description: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

transactionSchema.index({ order: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ partner: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
