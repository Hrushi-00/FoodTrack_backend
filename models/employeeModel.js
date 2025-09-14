import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Assuming you already have a User/Admin model
    required: true,
  },
  name: { 
    type: String,
    required: true
   },
  position: {
    type: String,
     required: true 
    },
  contact: { 
    type: String,
     required: true
     },
  salary: { 
    type: Number,
     required: true
     },

  leaves: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      reason: { type: String },
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    },
  ],

  payments: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      method: { type: String, enum: ["Cash", "Bank Transfer", "UPI"], default: "Cash" },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
