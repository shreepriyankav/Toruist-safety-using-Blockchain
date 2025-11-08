# Sample Data for Testing

## Test Tourists

### Tourist 1
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

### Tourist 2
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phoneNumber": "+0987654321",
  "password": "password123"
}
```

### Tourist 3
```json
{
  "name": "Mike Johnson",
  "email": "mike@example.com",
  "phoneNumber": "+1122334455",
  "password": "password123"
}
```

## Test Safe Zones

### Safe Zone 1 - City Center (New Delhi)
```json
{
  "name": "City Center Safe Zone",
  "center": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "radius": 5000
}
```

### Safe Zone 2 - Tourist District
```json
{
  "name": "Tourist District",
  "center": {
    "lat": 28.6562,
    "lng": 77.2410
  },
  "radius": 3000
}
```

### Safe Zone 3 - Airport Area
```json
{
  "name": "Airport Safe Zone",
  "center": {
    "lat": 28.5562,
    "lng": 77.1000
  },
  "radius": 8000
}
```

## Test Locations

### Inside Safe Zone (City Center)
```json
{
  "lat": 28.6139,
  "lng": 77.2090
}
```

### Outside Safe Zone
```json
{
  "lat": 28.7041,
  "lng": 77.1025
}
```

### Far Outside (Should trigger alert)
```json
{
  "lat": 28.9000,
  "lng": 77.5000
}
```

## Test Scenarios

### Scenario 1: Normal Tourist Journey
1. Register tourist
2. Login
3. Start at City Center (28.6139, 77.2090) - SAFE
4. Move to Tourist District (28.6562, 77.2410) - SAFE
5. Move to Airport (28.5562, 77.1000) - SAFE

### Scenario 2: Geo-Fence Breach
1. Register tourist
2. Login
3. Start at City Center (28.6139, 77.2090) - SAFE
4. Move outside (28.9000, 77.5000) - WARNING + Incident
5. Admin resolves incident
6. Tourist returns to safe zone

### Scenario 3: Multiple Tourists
1. Register 3 tourists
2. All login
3. Tourist 1 at (28.6139, 77.2090) - SAFE
4. Tourist 2 at (28.6562, 77.2410) - SAFE
5. Tourist 3 at (28.9000, 77.5000) - WARNING
6. Admin monitors all on map

### Scenario 4: Inactivity Detection
1. Register tourist
2. Login
3. Update location
4. Wait 30+ minutes without update
5. System detects inactivity anomaly

## Admin Credentials

```json
{
  "email": "admin@tourist.com",
  "password": "admin123"
}
```

## Sample API Requests

### Register Tourist
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123"
  }'
```

### Login Tourist
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Update Location
```bash
curl -X POST http://localhost:5000/api/tourist/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "lat": 28.6139,
    "lng": 77.2090
  }'
```

### Create Safe Zone (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/safezones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "name": "City Center",
    "center": {
      "lat": 28.6139,
      "lng": 77.2090
    },
    "radius": 5000
  }'
```

## Expected Blockchain Transactions

### Transaction 1: Tourist Registration
```
Function: registerTourist(name, email, phoneNumber)
From: Tourist wallet address
Gas: ~200,000
Event: TouristRegistered
```

### Transaction 2: Incident Report
```
Function: reportIncident(touristAddress, type, location, description)
From: Backend account
Gas: ~150,000
Event: IncidentReported
```

### Transaction 3: Resolve Incident
```
Function: resolveIncident(incidentId)
From: Admin/Backend account
Gas: ~50,000
Event: IncidentResolved
```

## Testing Checklist

- [ ] Register 3 tourists
- [ ] Login all tourists
- [ ] Create 3 safe zones
- [ ] Test location inside safe zone
- [ ] Test location outside safe zone
- [ ] Verify incident created on blockchain
- [ ] Admin views all tourists on map
- [ ] Admin views all incidents
- [ ] Admin resolves incident
- [ ] Verify incident resolved on blockchain
- [ ] Test real-time updates via Socket.IO
- [ ] Test anomaly detection (inactivity)
- [ ] Test anomaly detection (sudden movement)

## Performance Benchmarks

- Tourist registration: < 2 seconds
- Location update: < 500ms
- Blockchain transaction: 1-3 seconds
- Map rendering: < 1 second
- Real-time update latency: < 100ms

## Dummy Wallet Addresses (Ganache)

Ganache provides 10 accounts by default:
```
Account 0: 0x... (used for contract deployment)
Account 1: 0x... (can be used for testing)
Account 2: 0x... (can be used for testing)
...
```

Each account has 100 ETH for testing.
