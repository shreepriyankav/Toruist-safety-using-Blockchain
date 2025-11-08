// Geo-fencing utility functions

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Check if tourist is within safe zone
function isWithinSafeZone(touristLat, touristLng, zoneLat, zoneLng, radius) {
    const distance = calculateDistance(touristLat, touristLng, zoneLat, zoneLng);
    return distance <= radius;
}

// Check for anomalies (AI logic)
function detectAnomalies(tourist, lastLocation, currentLocation, lastActiveTime) {
    const anomalies = [];
    
    // Check for inactivity (no movement for 30 minutes)
    const inactivityThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds
    const timeSinceActive = Date.now() - new Date(lastActiveTime).getTime();
    
    if (timeSinceActive > inactivityThreshold) {
        anomalies.push({
            type: 'inactivity',
            severity: 'medium',
            message: 'Tourist has been inactive for more than 30 minutes'
        });
    }
    
    // Check for sudden large movement (possible emergency)
    if (lastLocation && currentLocation) {
        const distance = calculateDistance(
            lastLocation.lat, lastLocation.lng,
            currentLocation.lat, currentLocation.lng
        );
        
        // If moved more than 10km in short time
        if (distance > 10000) {
            anomalies.push({
                type: 'sudden_movement',
                severity: 'high',
                message: 'Unusual rapid movement detected'
            });
        }
    }
    
    return anomalies;
}

// Check if tourist is in safe zone from global database
function checkSafeZone(touristLat, touristLng, globalLocations) {
    for (const location of globalLocations) {
        if (location.safety_status === 'Safe' && location.safe_zone_radius) {
            const distance = calculateDistance(
                touristLat, touristLng,
                location.coordinates.lat, location.coordinates.lng
            );
            
            if (distance <= location.safe_zone_radius) {
                return {
                    inSafeZone: true,
                    location: location,
                    distance: distance
                };
            }
        }
    }
    return { inSafeZone: false };
}

// Check if tourist is in restricted area from global database
function checkRestrictedArea(touristLat, touristLng, globalLocations) {
    for (const location of globalLocations) {
        if (location.safety_status === 'Restricted') {
            const distance = calculateDistance(
                touristLat, touristLng,
                location.coordinates.lat, location.coordinates.lng
            );
            
            const radius = location.restriction_radius || 3000;
            
            if (distance <= radius) {
                return {
                    inRestrictedArea: true,
                    location: location,
                    distance: distance
                };
            }
        }
    }
    
    return { inRestrictedArea: false };
}

module.exports = {
    calculateDistance,
    isWithinSafeZone,
    detectAnomalies,
    checkRestrictedArea,
    checkSafeZone
};
