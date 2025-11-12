import { stripe } from './stripeConfig.js';
import User from '../auth/userModel.js';


export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId; 
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (user.isPaid) {
      return res.status(400).json({ message: 'User has already paid' });
    }

    const origin = req.headers.origin || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'BGN', 
            product_data: {
              name: 'Premium Access - Full Employee Table',
              description: 'Unlock full access to all employee records in the table',
              images: [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', // Иконка/изображение за продукта
              ],
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/employee`,
      client_reference_id: userId.toString(), 
      metadata: {
        userId: userId.toString(),
      },
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const checkPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId; 
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const targetUserId = session.client_reference_id || session.metadata?.userId || userId;
      
      if (targetUserId) {
        try {
          const user = await User.findByIdAndUpdate(
            targetUserId, 
            { isPaid: true },
            { new: true }
          );
          
          if (user) {
            console.log(`✅ User ${targetUserId} payment verified and isPaid updated to true`);
          }
        } catch (error) {
          console.error('Error updating user payment status:', error);
         
        }
      }
    }
    
    res.json({
      status: session.payment_status,
      paid: session.payment_status === 'paid',
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * Обработва webhook от Stripe за успешни плащания
 * Това endpoint трябва да се извиква от Stripe автоматично
 * Забележка: Webhook е опционален - ако няма STRIPE_WEBHOOK_SECRET, 
 * плащането ще се обновява автоматично при checkPaymentStatus
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Ако няма webhook secret, просто игнорираме webhook-а
  // (обновяването ще стане при checkPaymentStatus)
  if (!webhookSecret) {
    console.log('ℹ️  Webhook received but STRIPE_WEBHOOK_SECRET not set - ignoring (payment will be updated via checkPaymentStatus)');
    return res.json({ received: true, message: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработваме успешно плащане
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Проверяваме дали плащането е успешно
    if (session.payment_status === 'paid') {
      const userId = session.client_reference_id || session.metadata?.userId;

      if (userId) {
        try {
          // Обновяваме isPaid на true
          await User.findByIdAndUpdate(userId, { isPaid: true });
          console.log(`User ${userId} payment completed successfully`);
        } catch (error) {
          console.error('Error updating user payment status:', error);
        }
      }
    }
  }

  res.json({ received: true });
};

