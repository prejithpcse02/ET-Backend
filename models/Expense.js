import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["Food", "Bills", "Transport", "Healthcare", "Personal", "Other"],
      required: true,
    },
    amount: { type: Number, required: true },
    type: { type: String },
    desc: { type: String },
    mode: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
