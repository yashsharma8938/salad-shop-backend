const express = require('express');
const Review = require('../models/Review');
const Salad = require('../models/Salad');
const { auth } = require('../middleware/auth');
const router = express.Router();

// POST /api/reviews
router.post('/', auth, async (req, res) => {
    try {
        const { saladId, rating, comment } = req.body;
        const review = new Review({
            user: req.user._id,
            salad: saladId,
            rating,
            comment,
            userName: req.user.name || 'Customer'
        });
        await review.save();

        // Update salad rating
        const reviews = await Review.find({ salad: saladId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await Salad.findByIdAndUpdate(saladId, { rating: avgRating.toFixed(1), reviewCount: reviews.length });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/reviews/salad/:id
router.get('/salad/:id', async (req, res) => {
    try {
        const reviews = await Review.find({ salad: req.params.id }).sort({ createdAt: -1 }).limit(20);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/reviews/recent
router.get('/recent', async (req, res) => {
    try {
        const reviews = await Review.find({ rating: { $gte: 4 } }).sort({ createdAt: -1 }).limit(6).populate('salad', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
