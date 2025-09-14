import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import mealTokenRoutes from "./routes/mealTokenRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

import path from "path";
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
// Use routes
app.use("/api/menu", menuRoutes);
app.use("/api/tokens", mealTokenRoutes);
app.use("/tokens", express.static(path.join(process.cwd(), "tokens")));


app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
