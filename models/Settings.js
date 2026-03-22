const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    liveStreamUrl: { type: String, default: '' },
    liveStreamEnabled: { type: Boolean, default: false },
    healthTip: { type: String, default: 'Eat more greens for a healthier life! 🥬' },
    popupMessages: {
        type: [String],
        default: [
            '🥗 Time to recharge with something healthy!',
            '🥗 Your body deserves fresh salads today!',
            '🥗 Fresh salads prepared today – order before they sell out!',
            '🥗 Healthy food time! Dive into fresh bowls.'
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
