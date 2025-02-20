import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

//API Routes
app.use("/api/auth", userRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) =>
  res.send({
    status: 200,
    message: "✅ API is running...",
    dbStatus: "✅ MongoDB is connected...",
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
