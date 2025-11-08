const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials'] },
  price: { type: Number, required: true },
  discountPrice: Number,
  image: { type: String, default: 'https://via.placeholder.com/300' },
  ingredients: [String],
  tags: [String],
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 20 },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  ratings: { average: { type: Number, default: 0, min: 0, max: 5 }, count: { type: Number, default: 0 } },
  nutritionInfo: { calories: Number, protein: Number, carbs: Number, fat: Number },
  spiceLevel: { type: String, enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'] }
}, { timestamps: true });

menuItemSchema.index({ partner: 1, category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
