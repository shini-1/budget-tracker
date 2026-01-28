const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., '2023-10'
  timeline: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'], default: 'monthly' }, // Budget period
  startDate: { type: Date }, // For custom date range
  endDate: { type: Date } // For custom date range
});

module.exports = mongoose.model('Budget', budgetSchema);
