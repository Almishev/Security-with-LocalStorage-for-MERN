import express from 'express';
import { 
  createCheckoutSession, 
  checkPaymentStatus, 
  handleWebhook 
} from './stripeController.js';
import { authenticateToken } from '../auth/middleware.js';

const router = express.Router();

router.post('/webhook', handleWebhook);

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.get('/check-status/:sessionId', authenticateToken, checkPaymentStatus);

export default router;

