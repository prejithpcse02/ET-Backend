import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      description,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
