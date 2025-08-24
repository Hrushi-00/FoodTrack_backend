import express from "express";
import { generateToken, getTokensByDate, getUserTokens } from "../controllers/mealTokenController.js";

const router = express.Router();

// Generate a new token
router.post("/generate", generateToken);

// Get all tokens for a specific date
router.get("/date/:date", getTokensByDate);

// Get all tokens for a specific user
router.get("/user/:userId", getUserTokens);

export default router;
