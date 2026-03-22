const express = require('express');
const Salad = require('../models/Salad');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// ---- SALAD MANAGEMENT ----

// POST /api/admin/salads
router.post('/salads', adminAuth, async (req, res) => {
    try {
        const salad = new Salad(req.body);
        await salad.save();
        res.status(201).json(salad);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/admin/salads/:id
router.put('/salads/:id', adminAuth, async (req, res) => {
    try {
        const salad = await Salad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!salad) return res.status(404).json({ message: 'Salad not found' });
        res.json(salad);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin/salads/:id
router.delete('/salads/:id', adminAuth, async (req, res) => {
    try {
        await Salad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Salad deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- ORDER MANAGEMENT ----

// GET /api/admin/orders
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        const orders = await Order.find(query).sort({ createdAt: -1 }).populate('user', 'name email phone');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- SETTINGS ----

// GET /api/admin/settings
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/settings
router.put('/settings', adminAuth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = new Settings();
        Object.assign(settings, req.body);
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- DASHBOARD STATS ----
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({ createdAt: { $gte: todayStart } });
        const totalRevenue = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
        const totalSalads = await Salad.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: { $in: ['placed', 'preparing'] } });

        res.json({
            totalOrders,
            todayOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalSalads,
            pendingOrders
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
