const mongoose = require('mongoose');

const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Housing',
  'Utilities',
  'Health',
  'Shopping',
  'Entertainment',
  'Education',
  'Other',
];

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, enum: CATEGORIES },
    amount: { type: Number, required: true, min: 0.01, max: 100000000 },
    comments: { type: String, trim: true, maxlength: 250, default: '' },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
