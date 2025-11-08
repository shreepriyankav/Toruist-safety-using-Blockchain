# Quick Setup Guide

## Step-by-Step Installation

### Step 1: Install Required Software

1. **Node.js** (v16+)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Start service after installation

3. **Ganache** (Local Blockchain)
   - Download: https://trufflesuite.com/ganache/
   - Install and launch
   - Keep it running (default: http://127.0.0.1:7545)

### Step 2: Install Project Dependencies

Open 3 separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 3 - Contracts:**
```bash
cd contracts
npm install web3 solc
```

### Step 3: Deploy Smart Contract

In Terminal 3:
```bash
cd contracts
node deploy.js
```

Expected output:
```
Deploying from account: 0x...
Contract deployed at: 0x...
Contract info saved to contractInfo.json
```

### Step 4: Start Backend

In Terminal 1:
```bash
cd backend
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
Blockchain URL: http://127.0.0.1:7545
```

### Step 5: Start Frontend

In Terminal 2:
```bash
cd frontend
npm start
```

Browser opens automatically at: `http://localhost:3000`

## First Time Usage

### 1. Register as Tourist

1. Click "Register"
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: password123
3. **IMPORTANT**: Save the wallet address and private key shown
4. Click "Continue to Login"

### 2. Login as Tourist

1. Enter email and password
2. You'll see the Tourist Dashboard

### 3. Test Geo-Fencing

1. Open another browser tab
2. Go to `http://localhost:3000/admin/login`
3. Login with:
   - Email: admin@tourist.com
   - Password: admin123

4. In Admin Dashboard:
   - Create a safe zone:
     - Name: "City Center"
     - Lat: 28.6139
     - Lng: 77.2090
     - Radius: 5000

5. Back in Tourist Dashboard:
   - Click "Move to Safe Zone" → Status: SAFE ✓
   - Click "Move Outside" → Alert triggered! ⚠️
   - Check "Incident History" → Blockchain record created

### 4. View Blockchain Transactions

1. Open Ganache
2. Click "Transactions" tab
3. See all blockchain operations:
   - Tourist registration
   - Incident reports
   - Incident resolutions

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Issue: "Contract deployment failed"
**Solution:**
- Ensure Ganache is running
- Check RPC URL is http://127.0.0.1:7545
- Restart Ganache if needed

### Issue: "Port 5000 already in use"
**Solution:**
Edit `backend/.env`:
```
PORT=5001
```
Then update frontend API_URL in components to use port 5001

### Issue: Map not showing
**Solution:**
- Check internet connection (needs OpenStreetMap)
- Clear browser cache
- Verify Leaflet CSS is loaded

## Testing Checklist

- [ ] Ganache running
- [ ] MongoDB running
- [ ] Smart contract deployed
- [ ] Backend server started (port 5000)
- [ ] Frontend started (port 3000)
- [ ] Tourist registration works
- [ ] Tourist login works
- [ ] Admin login works
- [ ] Safe zone creation works
- [ ] Location update works
- [ ] Geo-fence breach triggers alert
- [ ] Incidents visible in blockchain
- [ ] Admin can resolve incidents

## Default Credentials

**Admin:**
- Email: admin@tourist.com
- Password: admin123

**Test Tourist** (create your own):
- Register at /register

## Project URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Ganache RPC: http://127.0.0.1:7545
- MongoDB: mongodb://localhost:27017

## Next Steps

1. Create multiple tourist accounts
2. Create multiple safe zones
3. Test different scenarios:
   - Tourist inside safe zone
   - Tourist outside safe zone
   - Multiple tourists tracking
   - Incident resolution workflow

## Need Help?

Check:
1. All services are running (Ganache, MongoDB, Backend, Frontend)
2. No port conflicts
3. Contract is deployed (contractInfo.json exists)
4. Browser console for errors
5. Backend terminal for API errors

Enjoy testing the Smart Tourist Safety System! 🚀
