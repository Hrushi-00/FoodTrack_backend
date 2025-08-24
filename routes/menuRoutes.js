import express from "express";
import { addMenu, updateMenu, getMenuByDate, getAllMenus } from "../controllers/menuController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addMenu);
router.put("/update/:date", protect, updateMenu);
router.get("/:date", protect, getMenuByDate);
router.get("/", protect, getAllMenus);

export default router;
