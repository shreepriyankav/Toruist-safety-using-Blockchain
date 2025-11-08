# Global Tourist Location Database - Implementation Guide

## Overview
The Smart Tourist Safety Monitoring System now includes a **global location database** with verified safe and restricted tourist destinations worldwide. The system automatically detects when tourists enter restricted/dangerous areas and triggers alerts.

## Key Features

### 1. Global Location Database
- **File**: `backend/data/globalLocations.json`
- Contains 15+ verified tourist locations (safe and restricted)
- Each location includes:
  - Name, country, region, coordinates
  - Safety status (Safe/Restricted)
  - Restriction type, reason, level
  - Official government/UNESCO source
  - Last verification date
  - Admin notification flag

### 2. Restricted Area Detection
- **5km radius** around each restricted location
- Automatic detection when tourist enters restricted zone
- Real-time checking against global database

### 3. Alert System
When tourist enters restricted area:
- ✅ **2-second beep sound** plays on mobile device
- ✅ **SMS notification** sent to admin (via Twilio)
- ✅ **Blockchain record** created with transaction hash
- ✅ **Detailed alert** shows restriction info

### 4. SMS Integration (Twilio)
Configure in `backend/.env`:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_PHONE_NUMBER=+1234567890
```

**SMS Format**:
```
⚠️ Alert: Tourist [Name] (ID: [ID]) has entered a restricted area — [Location], [Country].
Reason: [Restriction Reason]
Level: [High/Medium/Low]
Coordinates: [lat], [lng]
Immediate attention required.
```

## Restricted Locations in Database

### High-Risk Restricted Areas
1. **Mount Everest Base Camp** (Nepal) - Permit Required
2. **Chernobyl Exclusion Zone** (Ukraine) - Radiation Hazard
3. **North Sentinel Island** (India) - Protected Tribal Area
4. **Area 51** (USA) - Military Zone
5. **Fukushima Exclusion Zone** (Japan) - Radiation Hazard
6. **Snake Island** (Brazil) - Wildlife Danger
7. **Heard Island** (Australia) - Environmental Protection

### Medium-Risk Restricted Areas
8. **Surtsey Island** (Iceland) - UNESCO Protected
9. **Poveglia Island** (Italy) - Abandoned Site
10. **Lascaux Caves** (France) - Cultural Heritage

### Safe Tourist Destinations
11. **Eiffel Tower** (France)
12. **Taj Mahal** (India)
13. **Machu Picchu** (Peru)
14. **Great Barrier Reef** (Australia)
15. **Ooty Hill Station** (India)

## API Endpoints

### Get All Locations
```
GET /api/locations
```

### Get Restricted Locations Only
```
GET /api/locations/restricted
```

### Get Safe Locations Only
```
GET /api/locations/safe
```

## Frontend Integration

### Location Dropdown
Tourist dashboard includes restricted areas with warning emojis:
- 🚨 Mount Everest Base Camp
- ☢️ Chernobyl Exclusion Zone
- 🚫 North Sentinel Island
- 🚫 Area 51
- ☢️ Fukushima Exclusion Zone
- 🐍 Snake Island

### Alert Display
When entering restricted area, tourist sees:
```
🚨 RESTRICTED AREA ALERT 🚨

Location: [Name], [Country]
Restriction: [Type]
Reason: [Detailed Reason]
Level: [High/Medium/Low]
Status: [Open/Closed/Permit Required]
Distance: [X]m from center

⚠️ Admin has been notified via SMS
📝 Incident recorded on blockchain
🔗 TX Hash: [Transaction Hash]

Source: [Official Government URL]
```

## Backend Implementation

### Files Modified/Created
1. **`backend/data/globalLocations.json`** - Global database
2. **`backend/utils/smsService.js`** - SMS alert service
3. **`backend/utils/geoFencing.js`** - Added `checkRestrictedArea()` function
4. **`backend/routes/tourist.js`** - Enhanced location update with restricted area check
5. **`backend/routes/locations.js`** - New API endpoints for locations
6. **`backend/server.js`** - Added locations route

### Geo-Fencing Logic
```javascript
// Check if tourist is within 5km of restricted area
function checkRestrictedArea(touristLat, touristLng, globalLocations) {
    const restrictedZoneRadius = 5000; // 5km
    
    for (const location of globalLocations) {
        if (location.safety_status === 'Restricted') {
            const distance = calculateDistance(
                touristLat, touristLng,
                location.coordinates.lat, location.coordinates.lng
            );
            
            if (distance <= restrictedZoneRadius) {
                return { inRestrictedArea: true, location, distance };
            }
        }
    }
    
    return { inRestrictedArea: false };
}
```

## Testing the System

### Step 1: Setup SMS (Optional)
1. Create Twilio account: https://www.twilio.com
2. Get Account SID, Auth Token, and phone number
3. Update `backend/.env` with credentials
4. If not configured, system logs alerts to console

### Step 2: Test Restricted Area Entry
1. Login as tourist
2. Select restricted location from dropdown (e.g., "🚨 Mount Everest Base Camp")
3. System will:
   - Play 2-second beep sound
   - Show detailed alert popup
   - Send SMS to admin (if configured)
   - Record incident on blockchain
   - Display transaction hash

### Step 3: Verify Blockchain Record
1. Login as admin
2. View "Incidents (Blockchain Records)" section
3. See incident with type: `restricted_area_entry`
4. Check description for location details

### Step 4: Check Admin Dashboard
1. View incident details
2. Resolve incident if needed
3. Check tourist safety status (should be "danger")

## Data Verification Sources

All restricted areas verified from official sources:
- **UNESCO**: https://whc.unesco.org
- **IAEA** (Nuclear): https://www.iaea.org
- **Government Tourism Boards**
- **National Park Services**
- **Military/Defense Departments**

## Privacy & Security

### Data Protection
- Only Digital ID stored on blockchain (no personal info)
- Tourist names/emails in MongoDB only
- Coordinates encrypted in transit
- Admin-only access to full incident logs

### Safety Rules
- No bypass instructions provided
- No access routes to restricted areas
- Only verified official data sources
- Clear warning labels on all restricted zones

## Installation

### Install Twilio (Optional)
```bash
cd backend
npm install twilio
```

### Restart Backend
```bash
cd backend
npm start
```

### Restart Frontend
```bash
cd frontend
npm start
```

## Configuration

### Add More Locations
Edit `backend/data/globalLocations.json`:
```json
{
  "name": "New Restricted Area",
  "country": "Country Name",
  "region": "Region",
  "coordinates": {"lat": 0.0000, "lng": 0.0000},
  "safety_status": "Restricted",
  "restriction_type": "Type",
  "restriction_reason": "Detailed reason",
  "restriction_level": "High",
  "restriction_status": "Closed",
  "official_source": "https://official-url.com",
  "last_verified": "2024-01-20",
  "notify_admin": true
}
```

### Adjust Detection Radius
Edit `backend/utils/geoFencing.js`:
```javascript
const restrictedZoneRadius = 5000; // Change to desired meters
```

## Troubleshooting

### SMS Not Sending
- Check Twilio credentials in `.env`
- Verify phone numbers include country code (+1, +91, etc.)
- Check Twilio account balance
- System logs alerts to console if SMS fails

### Restricted Area Not Detected
- Verify location coordinates in `globalLocations.json`
- Check 5km radius calculation
- Ensure `safety_status` is "Restricted"
- Check backend console for errors

### Blockchain Transaction Fails
- Ensure Ganache is running
- Check contract deployment
- Verify `contractInfo.json` exists
- Check Ganache accounts have ETH

## Future Enhancements

1. **Real-time Government API Integration**
   - Auto-update restrictions from official APIs
   - Daily verification of restriction status

2. **Multi-language Support**
   - Translate alerts to tourist's language
   - Localized restriction information

3. **Emergency Response**
   - Direct connection to local authorities
   - Automatic rescue coordination

4. **Historical Data**
   - Track restriction changes over time
   - Seasonal restriction updates

5. **Mobile App**
   - Native iOS/Android apps
   - Real GPS integration
   - Offline mode with cached locations

## Support

For issues or questions:
- Check backend logs: `backend/` terminal
- Check frontend console: Browser DevTools
- Verify MongoDB connection
- Check Ganache blockchain status
- Review Twilio logs (if using SMS)

## License

MIT License - Educational purposes only
