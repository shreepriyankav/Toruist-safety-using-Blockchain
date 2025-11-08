# Smart Tourist Safety Monitoring & Incident Response System

A blockchain-based system for monitoring tourist safety using geo-fencing, AI anomaly detection, and Ethereum smart contracts.

## 🏗️ Project Structure

```
blockchain/
├── contracts/          # Solidity smart contracts
│   ├── TouristIdentity.sol
│   ├── deploy.js
│   └── contractInfo.json (generated after deployment)
├── backend/           # Node.js + Express API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Authentication middleware
│   ├── utils/         # Blockchain & geo-fencing utilities
│   └── server.js      # Main server file
└── frontend/          # React.js UI
    ├── public/
    └── src/
        ├── components/  # React components
        ├── App.js
        └── index.js
```

## 🚀 Features

1. **Blockchain-Based Digital Identity**
   - Ethereum wallet generation for each tourist
   - Smart contract stores tourist data immutably
   - Incident records stored on blockchain

2. **Geo-Fencing**
   - Define safe zones on interactive map
   - Real-time location tracking
   - Automatic alerts when tourists leave safe zones

3. **AI Monitoring**
   - Inactivity detection (30+ minutes)
   - Unusual movement pattern detection
   - Automatic incident reporting

4. **Admin Dashboard**
   - View all registered tourists
   - Live location tracking on map
   - Incident management from blockchain
   - Safe zone creation and management

5. **Tourist Dashboard**
   - View personal safety status
   - Location simulation for testing
   - View incident history from blockchain
   - Real-time alerts

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Ganache (for local Ethereum blockchain)
- npm or yarn

## 🔧 Installation & Setup

### 1. Install Ganache

Download and install Ganache from: https://trufflesuite.com/ganache/

Start Ganache and note the RPC Server URL (usually `http://127.0.0.1:7545`)

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Contracts:**
```bash
cd contracts
npm install web3 solc
```

### 3. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tourist_safety
JWT_SECRET=your_secret_key_here
BLOCKCHAIN_URL=http://127.0.0.1:7545
ADMIN_EMAIL=admin@tourist.com
ADMIN_PASSWORD=admin123
```

### 4. Start MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 5. Deploy Smart Contract

```bash
cd contracts
node deploy.js
```

This will:
- Compile the Solidity contract
- Deploy to Ganache
- Generate `contractInfo.json` with contract address and ABI

### 6. Start Backend Server

```bash
cd backend
npm start
```

Server runs on: `http://localhost:5000`

### 7. Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

## 🎮 Usage Guide

### Tourist Flow

1. **Register**
   - Go to `http://localhost:3000/register`
   - Fill in details (name, email, phone, password)
   - Save the generated wallet address and private key
   - Registration creates blockchain digital ID

2. **Login**
   - Use email and password to login
   - View dashboard with map and safety status

3. **Simulate Location**
   - Click "Simulate Movement" for random movement
   - Click "Move to Safe Zone" to enter safe area
   - Click "Move Outside" to trigger geo-fence breach alert

4. **View Incidents**
   - All incidents are recorded on blockchain
   - View incident history with timestamps
   - Check resolution status

### Admin Flow

1. **Login**
   - Go to `http://localhost:3000/admin/login`
   - Default credentials:
     - Email: `admin@tourist.com`
     - Password: `admin123`

2. **Create Safe Zones**
   - Enter zone name, center coordinates, and radius
   - Safe zones appear as green circles on map

3. **Monitor Tourists**
   - View all registered tourists in table
   - See live locations on map
   - Check safety status (safe/warning/danger)

4. **Manage Incidents**
   - View all incidents from blockchain
   - Resolve pending incidents
   - Incidents are permanently recorded on blockchain

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register tourist
- `POST /api/auth/login` - Tourist login
- `POST /api/auth/admin/login` - Admin login

### Tourist Routes
- `GET /api/tourist/profile` - Get tourist profile
- `POST /api/tourist/location` - Update location
- `GET /api/tourist/incidents` - Get tourist incidents

### Admin Routes
- `GET /api/admin/tourists` - Get all tourists
- `GET /api/admin/incidents` - Get all incidents
- `POST /api/admin/incidents/:id/resolve` - Resolve incident
- `POST /api/admin/safezones` - Create safe zone
- `GET /api/admin/safezones` - Get all safe zones
- `DELETE /api/admin/safezones/:id` - Delete safe zone

## 🧪 Testing the System

1. **Register a Tourist**
   - Create account and save wallet info

2. **Create Safe Zone (Admin)**
   - Login as admin
   - Create safe zone at coordinates (28.6139, 77.2090) with 5000m radius

3. **Test Geo-Fencing**
   - Login as tourist
   - Click "Move to Safe Zone" - Status should be "SAFE"
   - Click "Move Outside" - Alert triggered, incident recorded on blockchain

4. **View Blockchain Records**
   - Check admin dashboard for incident
   - Verify incident details (timestamp, location, type)
   - Resolve incident from admin panel

5. **Check Ganache**
   - Open Ganache
   - View "Transactions" tab
   - See all blockchain transactions (registration, incidents)

## 🔐 Smart Contract Functions

- `registerTourist()` - Register new tourist on blockchain
- `reportIncident()` - Record incident on blockchain
- `resolveIncident()` - Mark incident as resolved
- `getTourist()` - Retrieve tourist data
- `getIncident()` - Retrieve incident data
- `getTouristIncidents()` - Get all incidents for a tourist

## 📊 Database Schema

### Tourist (MongoDB)
- name, email, phoneNumber, password
- walletAddress (Ethereum address)
- currentLocation (lat, lng)
- safetyStatus (safe/warning/danger)
- lastActive

### SafeZone (MongoDB)
- name
- center (lat, lng)
- radius (meters)
- isActive

### Admin (MongoDB)
- email, password, name

## 🛠️ Technology Stack

- **Frontend**: React.js, Leaflet (maps), Socket.IO (real-time)
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB
- **Blockchain**: Ethereum (Ganache), Solidity, Web3.js
- **Authentication**: JWT, bcrypt
- **Notifications**: Fast2SMS (SMS alerts to admin)

## 🐛 Troubleshooting

**Contract deployment fails:**
- Ensure Ganache is running
- Check BLOCKCHAIN_URL in .env matches Ganache RPC

**MongoDB connection error:**
- Start MongoDB service
- Verify MONGODB_URI in .env

**Map not loading:**
- Check internet connection (OpenStreetMap tiles)
- Verify Leaflet CSS is loaded

**Blockchain transactions fail:**
- Ensure contract is deployed
- Check contractInfo.json exists
- Verify Ganache accounts have ETH

## 📝 Notes

- This is a simulation system - no real GPS hardware required
- All location updates are manual/simulated
- Blockchain uses local Ganache testnet (no real ETH)
- Default safe zone: New Delhi, India (28.6139, 77.2090)
- Inactivity threshold: 30 minutes
- Sudden movement threshold: 10km

## 🔮 Future Enhancements

- Real GPS integration via mobile app
- Machine learning for advanced anomaly detection
- Multi-language support
- Emergency SOS button
- Historical route playback
- Export incident reports
- Additional notification channels (Email, Telegram)

## 📄 License

MIT License - Free to use for educational purposes

## 👥 Support

For issues or questions, check:
- Ganache logs for blockchain errors
- Browser console for frontend errors
- Backend terminal for API errors
- MongoDB logs for database issues
