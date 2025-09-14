import express from "express";
import { generateToken, getTokensByDate, getMyTokens } from "../controllers/mealTokenController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Generate a new token
router.post("/generate", protect, generateToken);

// Get all tokens for a specific date
router.get("/date/:year/:month/:day", protect, getTokensByDate);
// Get all tokens for the authenticated user
router.get("/my-tokens", protect, getMyTokens);

export default router;
