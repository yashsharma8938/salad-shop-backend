const express = require('express');
const Salad = require('../models/Salad');
const router = express.Router();

// GET /api/salads — List all available salads
router.get('/', async (req, res) => {
    try {
        const { tag, search, category } = req.query;
        let query = { isAvailable: true };
        if (tag) query.tags = tag;
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const salads = await Salad.find(query).sort({ isTrending: -1, createdAt: -1 });
        res.json(salads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/salads/trending
router.get('/trending', async (req, res) => {
    try {
        const salads = await Salad.find({ isAvailable: true, isTrending: true }).limit(6);
        res.json(salads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/salads/:id
router.get('/:id', async (req, res) => {
    try {
        const salad = await Salad.findById(req.params.id);
        if (!salad) return res.status(404).json({ message: 'Salad not found' });
        res.json(salad);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
