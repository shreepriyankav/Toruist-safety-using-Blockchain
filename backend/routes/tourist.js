const express = require('express');
const router = express.Router();
const Tourist = require('../models/Tourist');
const SafeZone = require('../models/SafeZone');
const { verifyToken } = require('../middleware/auth');
const { isWithinSafeZone, detectAnomalies, checkRestrictedArea, checkSafeZone } = require('../utils/geoFencing');
const blockchainUtils = require('../utils/blockchain');
const { sendRealSMS } = require('../utils/fast2smsService');
const fs = require('fs');
const path = require('path');

// Update tourist location
router.post('/location', verifyToken, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const tourist = await Tourist.findById(req.userId);
        
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        
        const lastLocation = tourist.currentLocation;
        
        // Load global locations database
        const globalLocationsPath = path.join(__dirname, '../data/globalLocations.json');
        const globalLocations = JSON.parse(fs.readFileSync(globalLocationsPath, 'utf8'));
        
        // Check if in safe zone first
        const safeZoneCheck = checkSafeZone(lat, lng, globalLocations);
        
        // Check if in restricted area
        const restrictedCheck = checkRestrictedArea(lat, lng, globalLocations);
        
        // Update location
        tourist.currentLocation = { lat, lng };
        tourist.lastActive = new Date();
        
        // Handle safe zone entry (priority check)
        if (safeZoneCheck.inSafeZone) {
            const location = safeZoneCheck.location;
            tourist.safetyStatus = 'safe';
            
            await tourist.save();
            
            return res.json({
                message: 'SAFE AREA',
                safetyStatus: 'safe',
                safeZone: {
                    name: location.name,
                    country: location.country,
                    region: location.region,
                    distance: Math.round(safeZoneCheck.distance)
                },
                playAlert: false
            });
        }
        
        // Handle restricted area entry
        if (restrictedCheck.inRestrictedArea) {
            const location = restrictedCheck.location;
            tourist.safetyStatus = 'danger';
            
            // Report to blockchain with transaction hash
            let txHash = null;
            try {
                console.log('🚨 RESTRICTED AREA DETECTED:', location.name);
                console.log('📍 Tourist:', tourist.name, '| Wallet:', tourist.walletAddress);
                console.log('📝 Recording incident on blockchain...');
                
                const result = await blockchainUtils.reportIncident(
                    tourist.walletAddress,
                    'restricted_area_entry',
                    `${lat},${lng}`,
                    `Entered restricted area: ${location.name} - ${location.restriction_reason}`
                );
                txHash = result.transactionHash;
                
                console.log('✅ Blockchain incident recorded!');
                console.log('   TX Hash:', txHash);
                console.log('   Tourist Wallet:', tourist.walletAddress);
            } catch (error) {
                console.error('❌ Blockchain incident report failed:', error.message);
                console.error('Full error:', error);
            }
            
            // Send SMS alert to admin if required
            if (location.notify_admin) {
                await sendRealSMS(location, tourist.name, tourist._id, { lat, lng });
            }
            
            await tourist.save();
            
            return res.json({
                message: 'RESTRICTED AREA ALERT',
                safetyStatus: 'danger',
                restrictedArea: {
                    name: location.name,
                    country: location.country,
                    restriction_type: location.restriction_type,
                    restriction_reason: location.restriction_reason,
                    restriction_level: location.restriction_level,
                    restriction_status: location.restriction_status,
                    official_source: location.official_source,
                    distance: Math.round(restrictedCheck.distance)
                },
                playAlert: true,
                blockchainTxHash: txHash
            });
        }
        
        // Check MongoDB safe zones (admin-created)
        const safeZones = await SafeZone.find({ isActive: true });
        let isInSafeZone = false;
        
        for (const zone of safeZones) {
            if (isWithinSafeZone(lat, lng, zone.center.lat, zone.center.lng, zone.radius)) {
                isInSafeZone = true;
                break;
            }
        }
        
        // Update safety status - only warning if not in any safe zone
        if (!isInSafeZone) {
            tourist.safetyStatus = 'warning';
        } else {
            tourist.safetyStatus = 'safe';
        }
        
        // Detect anomalies
        const anomalies = detectAnomalies(tourist, lastLocation, { lat, lng }, tourist.lastActive);
        
        await tourist.save();
        
        res.json({
            message: 'Location updated',
            safetyStatus: tourist.safetyStatus,
            isInSafeZone,
            anomalies,
            playAlert: false
        });
    } catch (error) {
        res.status(500).json({ message: 'Location update failed', error: error.message });
    }
});

// Get tourist profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.userId).select('-password');
        
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        
        res.json(tourist);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
});

// Get tourist incidents from blockchain
router.get('/incidents', verifyToken, async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.userId);
        
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        
        console.log('📋 Fetching incidents for wallet:', tourist.walletAddress);
        
        // Fetch incidents from blockchain
        const contract = blockchainUtils.getContract();
        const incidentIds = await contract.methods.getTouristIncidents(tourist.walletAddress).call();
        
        console.log('   Found incident IDs:', incidentIds);
        
        const incidents = [];
        for (const id of incidentIds) {
            const incident = await blockchainUtils.getIncident(id);
            // Convert BigInt to string for JSON serialization
            incidents.push({ 
                id: id.toString(), 
                touristAddress: incident.touristAddress,
                incidentType: incident.incidentType,
                location: incident.location,
                timestamp: incident.timestamp.toString(),
                description: incident.description,
                resolved: incident.resolved
            });
        }
        
        console.log('   Total incidents:', incidents.length);
        res.json(incidents);
    } catch (error) {
        console.error('❌ Error fetching incidents:', error.message);
        res.status(500).json({ message: 'Failed to fetch incidents', error: error.message });
    }
});

module.exports = router;
