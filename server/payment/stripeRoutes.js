import express from 'express';
import { 
  createCheckoutSession, 
  checkPaymentStatus, 
  handleWebhook 
} from './stripeController.js';
import { authenticateToken } from '../auth/middleware.js';

const router = express.Router();

// Webhook endpoint - трябва да е ПРЕД bodyParser.json() в index.js
// За webhook използваме raw body, не JSON
router.post('/webhook', handleWebhook);

// Защитени endpoints - изискват автентификация
router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.get('/check-status/:sessionId', authenticateToken, checkPaymentStatus);

export default router;

