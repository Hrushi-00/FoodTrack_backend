import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
     type: String,
      required: true
     },
  mealType: {
     type: String,
      required: true 
    },
  tokenNumber: { 
    type: Number, 
    required: true 
  },
  items: [
    { 
      name: String,
     qty: Number,
      price: Number 
    }
    ],
  tableNumber: {
    type: Number,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  }
});

// Ensure uniqueness per admin/day/meal/tokenNumber
tokenSchema.index({ adminId: 1, date: 1, mealType: 1, tokenNumber: 1 }, { unique: true });

export default mongoose.model("Token", tokenSchema);

