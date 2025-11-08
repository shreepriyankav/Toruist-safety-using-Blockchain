const mongoose = require('mongoose');

// Safe Zone Schema for Geo-Fencing
const safeZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    center: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    radius: {
        type: Number,
        required: true,
        default: 3000 // 3km radius for zones
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SafeZone', safeZoneSchema);
