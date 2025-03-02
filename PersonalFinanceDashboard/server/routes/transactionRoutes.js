const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Get all transactions for a user
router.get('/', requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new transaction
router.post('/', requireAuth, async (req, res) => {
  try {
    // Convert amount to number explicitly
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount format" });
    }

    const transaction = new Transaction({
      ...req.body,
      amount: amount,
      userId: req.user._id
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error while creating transaction" });
  }
});

// Delete a transaction
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user._id 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a transaction
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    // If amount is being updated, convert it to number
    if (req.body.amount) {
      const amount = parseFloat(req.body.amount);
      if (isNaN(amount)) {
        return res.status(400).json({ message: "Invalid amount format" });
      }
      req.body.amount = amount;
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;