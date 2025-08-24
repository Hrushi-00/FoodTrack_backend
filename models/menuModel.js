import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,  // "YYYY-MM-DD"
    required: true
  },
  breakfast: [String],
  lunch: [String],
  dinner: [String]
}, { timestamps: true });

// ✅ Unique only on (userId + date)
menuSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Menu", menuSchema);
