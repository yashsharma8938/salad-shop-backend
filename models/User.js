const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: '' },
    otp: { type: String },
    otpExpiry: { type: Date },
    isAdmin: { type: Boolean, default: false },
    addresses: [{
        label: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
