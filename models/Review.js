const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salad: { type: mongoose.Schema.Types.ObjectId, ref: 'Salad', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    userName: { type: String, default: 'Customer' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
