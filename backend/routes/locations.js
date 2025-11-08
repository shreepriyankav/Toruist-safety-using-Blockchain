const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all locations with detection radius
router.get('/', async (req, res) => {
    try {
        const globalLocationsPath = path.join(__dirname, '../data/globalLocations.json');
        const globalLocations = JSON.parse(fs.readFileSync(globalLocationsPath, 'utf8'));
        
        // Filter locations that have detection radius
        const detectableLocations = globalLocations.filter(loc => {
            if (loc.safety_status === 'Safe' && loc.safe_zone_radius > 0) return true;
            if (loc.safety_status === 'Restricted' && loc.restriction_radius > 0) return true;
            return false;
        });
        
        res.json(detectableLocations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
    }
});

// Get restricted locations with radius only
router.get('/restricted', async (req, res) => {
    try {
        const globalLocationsPath = path.join(__dirname, '../data/globalLocations.json');
        const globalLocations = JSON.parse(fs.readFileSync(globalLocationsPath, 'utf8'));
        const restricted = globalLocations.filter(loc => 
            loc.safety_status === 'Restricted' && loc.restriction_radius > 0
        );
        res.json(restricted);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch restricted locations', error: error.message });
    }
});

// Get safe locations with radius only
router.get('/safe', async (req, res) => {
    try {
        const globalLocationsPath = path.join(__dirname, '../data/globalLocations.json');
        const globalLocations = JSON.parse(fs.readFileSync(globalLocationsPath, 'utf8'));
        const safe = globalLocations.filter(loc => 
            loc.safety_status === 'Safe' && loc.safe_zone_radius > 0
        );
        res.json(safe);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch safe locations', error: error.message });
    }
});

module.exports = router;
