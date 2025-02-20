{
  /*import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount } = req.body;
    const expense = new Expense({ user: req.user.id, category, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
});

// Get All Expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// Update Expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { category, amount } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, amount },
      { new: true }
    );
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
});

// Delete Expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
});

export default router;
*/
}

import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Create an Expense (User-Specific)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount, type, desc, mode } = req.body;
    const expense = new Expense({
      user: req.user.id,
      category,
      amount,
      type,
      desc,
      mode,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
});

// 🔹 Get Only the Logged-in User's Expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.id }; // ✅ Ensures user can only see their own expenses

    // Apply Filters
    if (category) query.category = category;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Pagination
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// 🔹 Update an Expense (Only the Owner Can Edit)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { category, amount } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, amount },
      { new: true }
    );
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
});

// 🔹 Delete an Expense (Only the Owner Can Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
});

export default router;
