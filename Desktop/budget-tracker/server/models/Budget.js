const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., '2023-10'
  timeline: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' } // Budget period
});

module.exports = mongoose.model('Budget', budgetSchema);
