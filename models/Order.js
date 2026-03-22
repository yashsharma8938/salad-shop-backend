const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        salad: { type: mongoose.Schema.Types.ObjectId, ref: 'Salad', required: true },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
        image: String
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'placed'
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    paymentId: { type: String, default: '' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({ status: this.status, timestamp: new Date() });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
