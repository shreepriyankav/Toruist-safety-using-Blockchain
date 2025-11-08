# 🚀 Quick Start Guide

Get the Smart Tourist Safety System running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Ganache installed and running
- [ ] Internet connection (for map tiles)

## 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

Open 3 terminals in the project root:

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
npm install
```

### Step 2: Start Services (1 minute)

1. **Start Ganache** (GUI application)
   - Click "Quickstart"
   - Note the RPC Server: http://127.0.0.1:7545

2. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

### Step 3: Deploy Contract (30 seconds)

In Terminal 3:
```bash
cd contracts
node deploy.js
```

Wait for: "Contract deployed at: 0x..."

### Step 4: Start Backend (30 seconds)

In Terminal 1:
```bash
cd backend
npm start
```

Wait for: "Server running on port 5000"

### Step 5: Start Frontend (1 minute)

In Terminal 2:
```bash
cd frontend
npm start
```

Browser opens automatically at http://localhost:3000

## First Test (2 minutes)

### 1. Register Tourist (30 seconds)
- Click "Register"
- Fill form:
  - Name: Test User
  - Email: test@example.com
  - Phone: +1234567890
  - Password: test123
- **SAVE the wallet address shown!**
- Click "Continue to Login"

### 2. Login as Admin (30 seconds)
- Open new tab: http://localhost:3000/admin/login
- Login:
  - Email: admin@tourist.com
  - Password: admin123

### 3. Create Safe Zone (30 seconds)
- In Admin Dashboard
- Fill form:
  - Name: Test Zone
  - Lat: 28.6139
  - Lng: 77.2090
  - Radius: 5000
- Click "Create Safe Zone"
- Green circle appears on map

### 4. Test Geo-Fencing (30 seconds)
- Go back to tourist tab
- Login with test@example.com / test123
- Click "Move to Safe Zone" → Status: SAFE ✅
- Click "Move Outside" → Alert! ⚠️
- Check "Incident History" → Blockchain record!

## Verify Blockchain

1. Open Ganache
2. Click "Transactions" tab
3. See your transactions:
   - Tourist registration
   - Incident report

## 🎉 Success!

You now have:
- ✅ Tourist registered on blockchain
- ✅ Safe zone created
- ✅ Geo-fencing working
- ✅ Incident recorded on blockchain
- ✅ Admin monitoring active

## What's Running?

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Check browser |
| Backend API | http://localhost:5000 | Check terminal |
| MongoDB | mongodb://localhost:27017 | Check service |
| Ganache | http://127.0.0.1:7545 | Check GUI |

## Quick Commands

**Stop all services:**
- Ctrl+C in all terminals
- Close Ganache

**Restart backend:**
```bash
cd backend
npm start
```

**Restart frontend:**
```bash
cd frontend
npm start
```

**Redeploy contract:**
```bash
cd contracts
node deploy.js
```

## Troubleshooting

**"Cannot connect to MongoDB"**
```bash
net start MongoDB
```

**"Contract deployment failed"**
- Ensure Ganache is running
- Check RPC URL: http://127.0.0.1:7545

**"Port 5000 in use"**
- Kill process or change port in backend/.env

**"Map not showing"**
- Check internet connection
- Clear browser cache

## Next Steps

1. **Create more tourists**
   - Register multiple accounts
   - Test simultaneous tracking

2. **Create more safe zones**
   - Different locations
   - Different radii

3. **Test scenarios**
   - Tourist inside zone
   - Tourist outside zone
   - Multiple tourists
   - Incident resolution

4. **Explore blockchain**
   - View transactions in Ganache
   - Check contract state
   - Verify immutability

## Useful URLs

- Tourist Login: http://localhost:3000/login
- Admin Login: http://localhost:3000/admin/login
- Register: http://localhost:3000/register
- API Docs: http://localhost:5000

## Default Credentials

**Admin:**
- Email: admin@tourist.com
- Password: admin123

**Test Tourist:**
- Create your own at /register

## Need Help?

1. Check all services are running
2. Check terminal for errors
3. Check browser console
4. Verify Ganache transactions
5. Check MongoDB connection

## Pro Tips

💡 Keep Ganache open to see real-time transactions
💡 Use multiple browser tabs for tourist + admin
💡 Check Network tab in browser DevTools for API calls
💡 MongoDB Compass for database visualization
💡 Postman for API testing

---

**Ready to explore!** 🚀

For detailed documentation, see:
- README.md - Full documentation
- SETUP_GUIDE.md - Detailed setup
- ARCHITECTURE.md - System design
- SAMPLE_DATA.md - Test scenarios
