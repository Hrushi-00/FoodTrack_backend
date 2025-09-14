import express from "express";
import { addEmployee, getEmployees, addLeave, addPayment } from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js"; // JWT middleware

const router = express.Router();

// Employee Management
router.post("/", protect, addEmployee);             // Add new employee
router.get("/", protect, getEmployees);             // Get all employees of logged-in admin
router.post("/:employeeId/leave", protect, addLeave);   // Add leave for an employee
router.post("/:employeeId/payment", protect, addPayment); // Add payment for an employee

export default router;
