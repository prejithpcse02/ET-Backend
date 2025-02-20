import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
//import transporter from "../config/emailConfig.js";

const router = express.Router();

// ✅ Register User (With Default Values for Threshold & Alerts)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received Data:", req.body);

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Assign Default Values
    const alertEnabled = false; // Default: Alerts OFF
    const maxThreshold = 10000; // Default Threshold: ₹10,000

    user = new User({
      name,
      email,
      password: hashedPassword,
      alertEnabled, // ✅ Now Defined
      maxThreshold, // ✅ Now Defined
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Store JWT securely in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Fetch User Data (Including `maxThreshold` & `alertEnabled`)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email maxThreshold alertEnabled"
    ); // ✅ Now Fetching Threshold & Alerts
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Update User Settings (Threshold & Alerts)
router.put("/user/:id", async (req, res) => {
  try {
    const { maxThreshold, alertEnabled } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { maxThreshold, alertEnabled },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User settings updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Logout User (Clears JWT Cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

// In userRoutes.js
/*router.post("/send-alert", async (req, res) => {
  const { email, name, totalExpense, threshold, percentage } = req.body;
  console.log("Email Alert Request Received:", {
    email,
    name,
    totalExpense,
    threshold,
    percentage,
  });

  if (!email || !name) {
    console.log("Missing required fields");
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Prepare email
    const mailOptions = {
      from: {
        name: "Expense Tracker",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "🚨 Expense Limit Alert - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #ef4444; margin-bottom: 20px;">Expense Alert</h2>
          
          <p style="color: #374151; font-size: 16px;">Hello ${name},</p>
          
          <p style="color: #374151; font-size: 16px;">
            Your monthly expenses have reached <strong style="color: #ef4444;">${percentage.toFixed(
              1
            )}%</strong> of your set limit.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #374151;">
              <strong>Current Expenses:</strong> ₹${totalExpense.toLocaleString()}
            </p>
            <p style="margin: 5px 0; color: #374151;">
              <strong>Monthly Limit:</strong> ₹${threshold.toLocaleString()}
            </p>
            <p style="margin: 5px 0; color: #374151;">
              <strong>Usage:</strong> ${percentage.toFixed(1)}%
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px;">
            Please review your expenses and consider adjusting your spending to stay within your budget.
          </p>
        </div>
      `,
    };

    console.log("Attempting to send email with options:", {
      to: email,
      from: process.env.EMAIL_USER,
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Alert email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Detailed error sending alert email:", {
      error: error.message,
      stack: error.stack,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: "Failed to send alert email",
      error: error.message,
      errorCode: error.code,
    });
  }
});
*/
export default router;

{
  /*}
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received Data:", req.body);

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    /*if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      alertEnabled,
      maxThreshold,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Store JWT securely in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      /*secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email"); // Only fetch name & email
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Logout User (Clears JWT Cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

export default router;*/
}
