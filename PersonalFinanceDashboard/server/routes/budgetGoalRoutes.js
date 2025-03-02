const express = require('express');
const router = express.Router();
const BudgetGoal = require('../models/budgetGoalModel');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Get all budget goals for a user
router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await BudgetGoal.find({ userId: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new budget goal
router.post('/', requireAuth, async (req, res) => {
  try {
    const goal = new BudgetGoal({
      ...req.body,
      userId: req.user._id,
      currentAmount: 0
    });
    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a budget goal
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const goal = await BudgetGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a budget goal
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const goal = await BudgetGoal.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
