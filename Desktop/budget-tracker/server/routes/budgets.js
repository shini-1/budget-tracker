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
    
    // Enrich budgets with spent amount
    const enrichedBudgets = await Promise.all(budgets.map(async (budget) => {
      const [year, month] = currentMonth.split('-');
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 1);
      
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            category: budget.category,
            type: 'expense',
            date: {
              $gte: startDate,
              $lt: endDate
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
    const { category, limit } = req.body;
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const budget = new Budget({
      user: req.user._id,
      category,
      limit,
      month
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
