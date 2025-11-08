const mongoose = require('mongoose');

// Tourist Schema for MongoDB
const touristSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    currentLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    safetyStatus: {
        type: String,
        enum: ['safe', 'warning', 'danger'],
        default: 'safe'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Tourist', touristSchema);
