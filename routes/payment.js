const express = require('express');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const router = express.Router();

// POST /api/payment/create-order (Razorpay demo)
router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        // In production, use actual Razorpay SDK:
        // const Razorpay = require('razorpay');
        // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR' });

        // Demo mode: generate a fake order ID
        const orderId = 'order_' + crypto.randomBytes(12).toString('hex');

        res.json({
            orderId,
            amount: amount * 100,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || 'demo_key'
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment error', error: error.message });
    }
});

// POST /api/payment/verify
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // In production, verify signature:
        // const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        // shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        // const digest = shasum.digest('hex');
        // if (digest !== razorpay_signature) return res.status(400).json({ message: 'Invalid payment' });

        // Demo mode: always succeed
        res.json({ verified: true, paymentId: razorpay_payment_id || 'pay_demo_' + Date.now() });
    } catch (error) {
        res.status(500).json({ message: 'Verification error' });
    }
});

module.exports = router;
