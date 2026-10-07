const express = require('express');
const Expense = require('../models/Expense');
const protect = require('../middleware/auth');

const { CATEGORIES } = Expense;
const router = express.Router();

router.use(protect);

function clean(body) {
  const errors = {};
  const category = String(body.category || '').trim();
  const amount = Number(body.amount);
  const comments = String(body.comments || '').trim();

  if (!CATEGORIES.includes(category)) errors.category = 'Choose a category from the list.';
  if (!Number.isFinite(amount) || amount <= 0) errors.amount = 'Enter an amount greater than zero.';
  else if (amount > 100000000) errors.amount = 'Amount is too large.';
  if (comments.length > 250) errors.comments = 'Comments can be up to 250 characters.';

  return { errors, values: { category, amount: Math.round(amount * 100) / 100, comments } };
}

const reject = (res, errors) =>
  res.status(400).json({ message: 'Please fix the highlighted fields.', errors });

// All expenses for the logged-in user, newest first
router.get('/', async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ expenses });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { errors, values } = clean(req.body);
    if (Object.keys(errors).length) return reject(res, errors);

    const expense = await Expense.create({ ...values, user: req.user._id });
    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { errors, values } = clean(req.body);
    if (Object.keys(errors).length) return reject(res, errors);

    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });

    expense.set(values);
    await expense.save();
    res.json({ expense });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
