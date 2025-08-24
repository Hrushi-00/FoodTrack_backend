import mongoose from "mongoose";

const mealTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString().split("T")[0], // only date part
  },
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  hotelName: {
    type: String,
    
  },
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique token per date & meal
mealTokenSchema.index({ date: 1, mealType: 1, tokenNumber: 1 }, { unique: true });

const MealToken = mongoose.model("MealToken", mealTokenSchema);
export default MealToken;
