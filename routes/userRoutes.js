import express from 'express';
const router = express.Router();
import { login, signup, } from '../controllers/authController.js';
// import { authenticate } from '../middleware/auth.js';

// Auth routes
router.post('/login', login);
router.post('/signup', signup);
// router.post('/forgot-password', forgotPassword);

export default router;
