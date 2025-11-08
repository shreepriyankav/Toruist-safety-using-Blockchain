import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Safe and Restricted Zones
const LOCATIONS = [
  // Safe Zones (Green)
  { name: '✅ Coimbatore City - Major urban area', lat: 11.0168, lng: 76.9558 },
  { name: '✅ Ooty Hill Station - Popular tourist destination', lat: 11.4102, lng: 76.6950 },
  { name: '✅ Marudhamalai Temple - Religious site', lat: 11.0494, lng: 76.8686 },
  { name: '✅ Valparai - Tea estate hill station', lat: 10.3270, lng: 76.9550 },
  { name: '✅ Kodaikanal - Hill station resort', lat: 10.2381, lng: 77.4892 },
  
  // Restricted Zones (Red)
  { name: '🚨 Anaimalai Tiger Reserve - Wildlife danger', lat: 10.4500, lng: 76.9500 },
  { name: '🚨 Tribal Settlement Areas - Protected tribal land', lat: 11.0000, lng: 76.5500 },
  { name: '🚨 Elephant Corridor - Wildlife movement zone', lat: 11.5000, lng: 77.2500 },
  { name: '🚨 Mudumalai Tiger Reserve - Tiger habitat', lat: 11.5800, lng: 76.5400 },
  { name: '🚨 Silent Valley National Park - UNESCO protected area', lat: 11.0900, lng: 76.4300 }
];

function TouristDashboard({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState({ lat: 11.4102, lng: 76.6950 }); // Default: Ooty
  const [selectedCity, setSelectedCity] = useState('✅ Ooty Hill Station - Popular tourist destination');
  const [safeZones, setSafeZones] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [safetyStatus, setSafetyStatus] = useState('safe');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    setUserData(data);
    
    fetchSafeZones();
    fetchIncidents();
    
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    return () => newSocket.close();
  }, []);

  const fetchSafeZones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/safezones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSafeZones(response.data);
    } catch (error) {
      console.error('Error fetching safe zones:', error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tourist/incidents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const playAlertSound = () => {
    // Create audio context for 2-second beep alert
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency for alarm sound
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    // Set volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    // Play 2-second beep for restricted area alert
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  const updateLocation = async (lat, lng) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/tourist/location`,
        { lat, lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setLocation({ lat, lng });
      setSafetyStatus(response.data.safetyStatus);
      
      // Emit location update via socket
      if (socket) {
        socket.emit('locationUpdate', {
          touristId: userData.id,
          location: { lat, lng },
          status: response.data.safetyStatus
        });
      }
      
      // Handle restricted area alert
      if (response.data.playAlert && response.data.restrictedArea) {
        playAlertSound();
        const area = response.data.restrictedArea;
        alert(
          `🚨 RESTRICTED AREA ALERT 🚨\n\n` +
          `Location: ${area.name}, ${area.country}\n` +
          `Restriction: ${area.restriction_type}\n` +
          `Reason: ${area.restriction_reason}\n` +
          `Level: ${area.restriction_level}\n` +
          `Status: ${area.restriction_status}\n` +
          `Distance: ${area.distance}m from center\n\n` +
          `⚠️ Admin has been notified via SMS\n` +
          `📝 Incident recorded on blockchain\n` +
          `🔗 TX Hash: ${response.data.blockchainTxHash?.substring(0, 20)}...\n\n` +
          `Source: ${area.official_source}`
        );
      } else if (response.data.safeZone) {
        alert(`✅ SAFE AREA\n\n${response.data.safeZone.name}\n${response.data.safeZone.region}`);
      } else if (response.data.safetyStatus === 'safe') {
        alert('✅ You are in a safe zone');
      }
      
      // Refresh incidents after a short delay to allow blockchain to process
      setTimeout(() => {
        fetchIncidents();
      }, 2000);
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error updating location. Check if backend is running.');
    }
  };

  const simulateMovement = () => {
    // Simulate random movement
    const newLat = location.lat + (Math.random() - 0.5) * 0.01;
    const newLng = location.lng + (Math.random() - 0.5) * 0.01;
    updateLocation(newLat, newLng);
  };

  const moveToSafeZone = () => {
    if (safeZones.length > 0) {
      const zone = safeZones[0];
      updateLocation(zone.center.lat, zone.center.lng);
    } else {
      alert('No safe zones created yet! Ask admin to create a safe zone first.');
    }
  };

  const moveOutsideSafeZone = () => {
    if (safeZones.length > 0) {
      const zone = safeZones[0];
      // Move 6km away from safe zone center
      updateLocation(zone.center.lat + 0.06, zone.center.lng + 0.06);
    } else {
      alert('No safe zones created yet! Ask admin to create a safe zone first.');
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const city = LOCATIONS.find(loc => loc.name === cityName);
    if (city) {
      setLocation({ lat: city.lat, lng: city.lng });
      updateLocation(city.lat, city.lng);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Tourist Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Welcome, {userData?.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      <div className="container">
        <div className="card">
          <h3>Safety Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`status-badge status-${safetyStatus}`}>
              {safetyStatus.toUpperCase()}
            </span>
            <span>Wallet: {userData?.walletAddress?.substring(0, 10)}...</span>
          </div>
        </div>
        
        <div className="card">
          <h3>Location Tracking</h3>
          
          <div className="form-group">
            <label>Select City/Location:</label>
            <select 
              value={selectedCity} 
              onChange={handleCityChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          
          <p>Current Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
          
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={simulateMovement} className="btn btn-primary">
              Simulate Movement
            </button>
            <button onClick={moveToSafeZone} className="btn btn-success">
              Move to Safe Zone
            </button>
            <button onClick={moveOutsideSafeZone} className="btn btn-danger">
              Move Outside (Test Alert)
            </button>
          </div>
          
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '400px' }} key={`${location.lat}-${location.lng}`}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Tourist marker */}
            <Marker position={[location.lat, location.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
            
            {/* Safe zones */}
            {safeZones.map((zone) => (
              <Circle
                key={zone._id}
                center={[zone.center.lat, zone.center.lng]}
                radius={zone.radius}
                pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
              >
                <Popup>{zone.name}</Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
        
        <div className="card">
          <h3>Safe & Restricted Zones</h3>
          {safeZones.length === 0 ? (
            <p>No zones created yet. Admin needs to create safe zones.</p>
          ) : (
            <div>
              <h4 style={{ color: '#28a745', marginBottom: '10px' }}>✅ Safe Zones ({safeZones.filter(z => z.isActive).length})</h4>
              {safeZones.filter(z => z.isActive).map((zone) => (
                <div key={zone._id} style={{ 
                  padding: '10px', 
                  marginBottom: '10px', 
                  background: '#d4edda', 
                  borderRadius: '5px',
                  border: '1px solid #c3e6cb'
                }}>
                  <strong>{zone.name}</strong>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    📍 Location: {zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    🔵 Radius: {zone.radius}m ({(zone.radius/1000).toFixed(1)}km)
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#155724' }}>
                    ✅ Status: Safe to visit
                  </p>
                </div>
              ))}
              
              <h4 style={{ color: '#dc3545', marginTop: '20px', marginBottom: '10px' }}>🚨 Restricted/Dangerous Areas (5 Zones)</h4>
              <div style={{ 
                padding: '10px', 
                background: '#f8d7da', 
                borderRadius: '5px',
                border: '1px solid #f5c6cb'
              }}>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#721c24', fontWeight: 'bold' }}>
                  ⚠️ Restricted zones marked with 🚨 in location dropdown:
                </p>
                <ul style={{ margin: '5px 0 5px 20px', fontSize: '14px', color: '#721c24' }}>
                  <li>Anaimalai Tiger Reserve - Wildlife danger</li>
                  <li>Tribal Settlement Areas - Protected tribal land</li>
                  <li>Elephant Corridor - Wildlife movement zone</li>
                  <li>Mudumalai Tiger Reserve - Tiger habitat</li>
                  <li>Silent Valley National Park - UNESCO protected</li>
                </ul>
                <p style={{ margin: '10px 0 5px 0', fontSize: '14px', color: '#721c24' }}>
                  🔴 Entering restricted zones triggers:
                </p>
                <ul style={{ margin: '5px 0 5px 20px', fontSize: '14px', color: '#721c24' }}>
                  <li>2-second audio beep alert</li>
                  <li>SMS notification to admin via Fast2SMS</li>
                  <li>Incident recorded on blockchain</li>
                  <li>Safety status changed to DANGER</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="card">
          <h3>Incident History (Blockchain)</h3>
          {incidents.length === 0 ? (
            <p>No incidents recorded</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {incidents.map((incident) => (
                <div key={incident.id} className="alert alert-warning" style={{ marginBottom: '10px' }}>
                  <strong>Incident #{incident.id}</strong>
                  <p>Type: {incident.incidentType}</p>
                  <p>Location: {incident.location}</p>
                  <p>Time: {new Date(Number(incident.timestamp) * 1000).toLocaleString()}</p>
                  <p>Status: {incident.resolved ? 'Resolved' : 'Pending'}</p>
                  <p>Description: {incident.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TouristDashboard;
