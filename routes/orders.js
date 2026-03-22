const express = require('express');
const Order = require('../models/Order');
const Salad = require('../models/Salad');
const { auth } = require('../middleware/auth');
const router = express.Router();

// POST /api/orders — Create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, address, paymentId } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const salad = await Salad.findById(item.saladId);
            if (!salad) return res.status(404).json({ message: `Salad not found: ${item.saladId}` });
            if (salad.stock < item.quantity) return res.status(400).json({ message: `${salad.name} is out of stock` });

            orderItems.push({
                salad: salad._id,
                name: salad.name,
                price: salad.price,
                quantity: item.quantity,
                image: salad.image
            });
            totalAmount += salad.price * item.quantity;

            salad.stock -= item.quantity;
            salad.ordersToday += item.quantity;
            await salad.save();
        }

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            address,
            paymentId: paymentId || '',
            paymentStatus: paymentId ? 'paid' : 'pending',
            status: 'placed',
            statusHistory: [{ status: 'placed', timestamp: new Date() }]
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/orders/my — Get user's orders
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.salad', 'name image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/orders/:id — Single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.salad', 'name image price');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
