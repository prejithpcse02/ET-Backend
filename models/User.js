import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    alertEnabled: { type: Boolean, default: false }, // ✅ Default false
    maxThreshold: { type: Number, default: 10000 }, // ✅ Default 10,000
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
