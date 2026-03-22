const mongoose = require('mongoose');

const saladSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    ingredients: [{ type: String }],
    tags: [{ type: String, enum: ['Protein', 'Vegan', 'Low Calories', 'Gluten Free', 'Keto', 'High Fiber'] }],
    category: { type: String, default: 'Salad' },
    isAvailable: { type: Boolean, default: true },
    stock: { type: Number, default: 20 },
    ordersToday: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Salad', saladSchema);
