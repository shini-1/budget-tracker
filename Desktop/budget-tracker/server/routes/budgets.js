const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all budgets for current month
router.get('/', auth, async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const budgets = await Budget.find({ 
      user: req.user._id,
      month: currentMonth 
    });
    
    // Enrich budgets with spent amount based on their timeline
    const enrichedBudgets = await Promise.all(budgets.map(async (budget) => {
      let filterStartDate, filterEndDate;
      
      if (budget.timeline === 'daily') {
        // Daily: only today
        filterStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        filterEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      } else if (budget.timeline === 'weekly') {
        // Weekly: last 7 days
        filterStartDate = new Date(today);
        filterStartDate.setDate(today.getDate() - 6);
        filterEndDate = new Date(today);
        filterEndDate.setDate(today.getDate() + 1);
      } else if (budget.timeline === 'custom' && budget.startDate && budget.endDate) {
        // Custom date range: only count within that range and only up to today
        filterStartDate = new Date(budget.startDate);
        filterEndDate = new Date(Math.min(new Date(budget.endDate).getTime(), today.getTime()));
        filterEndDate.setDate(filterEndDate.getDate() + 1);
      } else {
        // Monthly (default): current month only
        const [year, month] = currentMonth.split('-');
        filterStartDate = new Date(year, parseInt(month) - 1, 1);
        filterEndDate = new Date(year, parseInt(month), 1);
      }
      
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            category: budget.category,
            type: 'expense',
            date: {
              $gte: filterStartDate,
              $lt: filterEndDate
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      return {
        ...budget.toObject(),
        spent: spent[0]?.total || 0
      };
    }));
    
    res.json(enrichedBudgets);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, limit, timeline, startDate, endDate, month } = req.body;
    const today = new Date();
    const budgetMonth = month || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const budget = new Budget({
      user: req.user._id,
      category,
      limit,
      month: budgetMonth,
      timeline: timeline || 'monthly',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });
    
    await budget.save();
    res.status(201).json(budget);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { limit: req.body.limit },
      { new: true }
    );
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
