const express = require('express');
const router = express.Router();
const Tourist = require('../models/Tourist');
const SafeZone = require('../models/SafeZone');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const blockchainUtils = require('../utils/blockchain');

// Get all tourists
router.get('/tourists', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const tourists = await Tourist.find().select('-password');
        res.json(tourists);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tourists', error: error.message });
    }
});

// Get all incidents from blockchain
router.get('/incidents', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const contract = blockchainUtils.getContract();
        const incidentCount = await contract.methods.incidentCount().call();
        
        const incidents = [];
        for (let i = 1; i <= incidentCount; i++) {
            const incident = await blockchainUtils.getIncident(i);
            incidents.push({ id: i, ...incident });
        }
        
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch incidents', error: error.message });
    }
});

// Resolve incident
router.post('/incidents/:id/resolve', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await blockchainUtils.resolveIncident(id);
        
        res.json({ message: 'Incident resolved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resolve incident', error: error.message });
    }
});

// Create safe zone
router.post('/safezones', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { name, center, radius } = req.body;
        
        const safeZone = new SafeZone({
            name,
            center,
            radius
        });
        
        await safeZone.save();
        res.status(201).json(safeZone);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create safe zone', error: error.message });
    }
});

// Get all safe zones
router.get('/safezones', verifyToken, async (req, res) => {
    try {
        const safeZones = await SafeZone.find();
        res.json(safeZones);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch safe zones', error: error.message });
    }
});

// Delete safe zone
router.delete('/safezones/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await SafeZone.findByIdAndDelete(req.params.id);
        res.json({ message: 'Safe zone deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete safe zone', error: error.message });
    }
});

module.exports = router;
