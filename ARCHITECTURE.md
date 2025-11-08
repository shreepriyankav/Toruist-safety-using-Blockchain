# System Architecture

## Overview

The Smart Tourist Safety Monitoring System is a full-stack blockchain application with three main layers:

1. **Frontend Layer** (React.js)
2. **Backend Layer** (Node.js + Express)
3. **Blockchain Layer** (Ethereum Smart Contracts)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tourist    │  │    Admin     │  │  Map (Leaflet)│      │
│  │  Dashboard   │  │  Dashboard   │  │  Geo-Fencing │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    Socket.IO (Real-time)                     │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │   Tourist    │  │    Admin     │      │
│  │    Routes    │  │    Routes    │  │    Routes    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     JWT      │  │  Geo-Fencing │  │  Blockchain  │      │
│  │ Middleware   │  │   AI Logic   │  │    Utils     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│     MongoDB      │  │   Geo-Fencing    │  │  Ethereum (Web3) │
│   (Database)     │  │   Calculations   │  │    Ganache       │
│                  │  │                  │  │                  │
│ • Tourists       │  │ • Distance calc  │  │ • Smart Contract │
│ • Admins         │  │ • Zone check     │  │ • Digital IDs    │
│ • Safe Zones     │  │ • AI anomalies   │  │ • Incidents      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Component Details

### 1. Frontend Layer

**Technologies:**
- React.js 18
- React Router (navigation)
- Leaflet (maps)
- Socket.IO Client (real-time)
- Axios (HTTP requests)

**Components:**
- `Login.js` - Tourist authentication
- `Register.js` - Tourist registration with blockchain wallet
- `AdminLogin.js` - Admin authentication
- `TouristDashboard.js` - Tourist interface with map and incidents
- `AdminDashboard.js` - Admin monitoring and management

**Features:**
- Interactive map with markers and circles
- Real-time location updates
- Safety status indicators
- Incident history from blockchain
- Safe zone visualization

### 2. Backend Layer

**Technologies:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Web3.js (blockchain interaction)
- Socket.IO (WebSocket)
- JWT (authentication)
- bcrypt (password hashing)

**Structure:**

```
backend/
├── models/
│   ├── Tourist.js      # Tourist schema
│   ├── Admin.js        # Admin schema
│   └── SafeZone.js     # Safe zone schema
├── routes/
│   ├── auth.js         # Authentication endpoints
│   ├── tourist.js      # Tourist operations
│   └── admin.js        # Admin operations
├── middleware/
│   └── auth.js         # JWT verification
├── utils/
│   ├── blockchain.js   # Web3 integration
│   └── geoFencing.js   # Geo calculations & AI
└── server.js           # Main server
```

**API Endpoints:**

Authentication:
- POST `/api/auth/register` - Register tourist
- POST `/api/auth/login` - Tourist login
- POST `/api/auth/admin/login` - Admin login

Tourist:
- GET `/api/tourist/profile` - Get profile
- POST `/api/tourist/location` - Update location
- GET `/api/tourist/incidents` - Get incidents

Admin:
- GET `/api/admin/tourists` - List all tourists
- GET `/api/admin/incidents` - List all incidents
- POST `/api/admin/incidents/:id/resolve` - Resolve incident
- POST `/api/admin/safezones` - Create safe zone
- GET `/api/admin/safezones` - List safe zones
- DELETE `/api/admin/safezones/:id` - Delete safe zone

### 3. Blockchain Layer

**Technology:**
- Solidity 0.8.0
- Ethereum (Ganache testnet)
- Web3.js

**Smart Contract: TouristIdentity.sol**

**Structures:**
```solidity
struct Tourist {
    string name;
    string email;
    string phoneNumber;
    uint256 registrationTime;
    bool isActive;
    address walletAddress;
}

struct Incident {
    uint256 incidentId;
    address touristAddress;
    string incidentType;
    string location;
    uint256 timestamp;
    string description;
    bool resolved;
}
```

**Functions:**
- `registerTourist()` - Store tourist on blockchain
- `reportIncident()` - Record incident immutably
- `resolveIncident()` - Mark incident resolved
- `getTourist()` - Retrieve tourist data
- `getIncident()` - Retrieve incident data
- `getTouristIncidents()` - Get all tourist incidents

**Events:**
- `TouristRegistered` - Emitted on registration
- `IncidentReported` - Emitted on incident
- `IncidentResolved` - Emitted on resolution

## Data Flow

### Tourist Registration Flow

```
1. User fills registration form
   ↓
2. Frontend sends POST /api/auth/register
   ↓
3. Backend creates Ethereum wallet
   ↓
4. Backend saves to MongoDB
   ↓
5. Backend calls smart contract registerTourist()
   ↓
6. Blockchain stores tourist data
   ↓
7. Frontend receives wallet address & private key
```

### Location Update & Geo-Fencing Flow

```
1. Tourist updates location (simulated)
   ↓
2. Frontend sends POST /api/tourist/location
   ↓
3. Backend receives {lat, lng}
   ↓
4. Backend fetches all safe zones from MongoDB
   ↓
5. Backend calculates distance using Haversine formula
   ↓
6. Backend checks if inside any safe zone
   ↓
7. If OUTSIDE safe zone:
   ├─ Update safety status to "warning"
   ├─ Call smart contract reportIncident()
   └─ Emit Socket.IO alert
   ↓
8. If INSIDE safe zone:
   └─ Update safety status to "safe"
   ↓
9. Backend runs AI anomaly detection
   ↓
10. Frontend receives updated status
```

### Incident Management Flow

```
1. Admin views incidents in dashboard
   ↓
2. Frontend calls GET /api/admin/incidents
   ↓
3. Backend calls smart contract getIncident()
   ↓
4. Blockchain returns incident data
   ↓
5. Frontend displays incidents
   ↓
6. Admin clicks "Resolve"
   ↓
7. Frontend calls POST /api/admin/incidents/:id/resolve
   ↓
8. Backend calls smart contract resolveIncident()
   ↓
9. Blockchain updates incident.resolved = true
   ↓
10. Frontend refreshes incident list
```

## Security Features

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing with bcrypt
   - Token verification middleware

2. **Blockchain Security**
   - Immutable incident records
   - Transparent transaction history
   - Decentralized data storage

3. **Data Validation**
   - Input sanitization
   - Schema validation (Mongoose)
   - Type checking

4. **Access Control**
   - Role-based access (tourist/admin)
   - Protected routes
   - Admin-only operations

## AI/ML Components

**Anomaly Detection Logic:**

1. **Inactivity Detection**
   - Threshold: 30 minutes
   - Triggers: No location update
   - Severity: Medium

2. **Unusual Movement**
   - Threshold: 10km sudden movement
   - Triggers: Large distance in short time
   - Severity: High

3. **Geo-Fence Breach**
   - Triggers: Exit from safe zone
   - Severity: High
   - Action: Blockchain incident report

## Real-Time Communication

**Socket.IO Events:**

Server → Client:
- `touristLocationUpdate` - Broadcast location changes
- `newAlert` - Broadcast new incidents

Client → Server:
- `locationUpdate` - Send location data
- `alertTriggered` - Send alert notification

## Database Schema

**MongoDB Collections:**

1. **tourists**
   - _id, name, email, phoneNumber, password
   - walletAddress, currentLocation
   - safetyStatus, lastActive, isActive

2. **admins**
   - _id, email, password, name

3. **safezones**
   - _id, name, center {lat, lng}
   - radius, isActive

**Blockchain Storage:**

1. **tourists mapping**
   - address → Tourist struct

2. **incidents mapping**
   - incidentId → Incident struct

3. **touristIncidents mapping**
   - address → incidentId[]

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend (JWT)
   - Load balancer ready
   - MongoDB replica sets

2. **Caching**
   - Safe zones cached in memory
   - Tourist data cached per session

3. **Optimization**
   - Batch blockchain reads
   - Indexed MongoDB queries
   - Lazy loading on frontend

## Deployment Architecture

**Production Setup:**

```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Backend│ │Backend│
│Node 1 │ │Node 2 │
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
    ┌────▼────┐
    │ MongoDB │
    │ Cluster │
    └─────────┘
         │
    ┌────▼────────┐
    │  Ethereum   │
    │  Mainnet/   │
    │  Testnet    │
    └─────────────┘
```

## Technology Choices Rationale

1. **React.js** - Component reusability, virtual DOM performance
2. **Node.js** - JavaScript full-stack, async I/O
3. **MongoDB** - Flexible schema, geospatial queries
4. **Ethereum** - Immutable records, transparency
5. **Leaflet** - Lightweight, open-source maps
6. **Socket.IO** - Real-time bidirectional communication
7. **JWT** - Stateless authentication, scalable

## Future Architecture Enhancements

1. **Microservices**
   - Separate auth service
   - Separate blockchain service
   - API gateway

2. **Message Queue**
   - RabbitMQ/Kafka for async processing
   - Decouple incident reporting

3. **CDN**
   - Static asset delivery
   - Global distribution

4. **Monitoring**
   - Prometheus metrics
   - Grafana dashboards
   - Error tracking (Sentry)

5. **Mobile App**
   - React Native
   - Real GPS integration
   - Push notifications
