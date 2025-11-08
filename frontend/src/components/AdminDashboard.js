import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

function AdminDashboard({ onLogout }) {
  const [tourists, setTourists] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [newZone, setNewZone] = useState({
    name: '',
    lat: 11.0168,
    lng: 76.9558,
    radius: 3000
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchTourists();
    fetchIncidents();
    fetchSafeZones();
    
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    newSocket.on('touristLocationUpdate', (data) => {
      console.log('Location update received:', data);
      fetchTourists();
    });
    
    newSocket.on('newAlert', (data) => {
      console.log('New alert:', data);
      fetchIncidents();
    });
    
    return () => newSocket.close();
  }, []);

  const fetchTourists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/tourists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTourists(response.data);
    } catch (error) {
      console.error('Error fetching tourists:', error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/incidents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

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

  const createSafeZone = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/admin/safezones`,
        {
          name: newZone.name,
          center: { lat: parseFloat(newZone.lat), lng: parseFloat(newZone.lng) },
          radius: parseInt(newZone.radius)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNewZone({ name: '', lat: 11.0168, lng: 76.9558, radius: 3000 });
      fetchSafeZones();
      alert('Safe zone created successfully');
    } catch (error) {
      console.error('Error creating safe zone:', error);
      alert('Failed to create safe zone');
    }
  };

  const resolveIncident = async (incidentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/admin/incidents/${incidentId}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchIncidents();
      alert('Incident resolved successfully');
    } catch (error) {
      console.error('Error resolving incident:', error);
      alert('Failed to resolve incident');
    }
  };

  const deleteSafeZone = async (zoneId) => {
    if (!window.confirm('Are you sure you want to delete this safe zone?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/safezones/${zoneId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchSafeZones();
      alert('Safe zone deleted');
    } catch (error) {
      console.error('Error deleting safe zone:', error);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </div>
      
      <div className="container">
        <div className="card">
          <h3>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <h4>{tourists.length}</h4>
              <p>Total Tourists</p>
            </div>
            <div>
              <h4>{incidents.filter(i => !i.resolved).length}</h4>
              <p>Active Incidents</p>
            </div>
            <div>
              <h4>{safeZones.length}</h4>
              <p>Safe Zones</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3>Live Tourist Tracking</h3>
          <MapContainer center={[11.0168, 76.9558]} zoom={10} style={{ height: '400px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            
            {/* Tourist markers */}
            {tourists.map((tourist) => (
              tourist.currentLocation && (
                <Marker 
                  key={tourist._id} 
                  position={[tourist.currentLocation.lat, tourist.currentLocation.lng]}
                >
                  <Popup>
                    <strong>{tourist.name}</strong><br />
                    Status: <span className={`status-badge status-${tourist.safetyStatus}`}>
                      {tourist.safetyStatus}
                    </span><br />
                    Email: {tourist.email}
                  </Popup>
                </Marker>
              )
            ))}
            
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
          <h3>Create Safe Zone</h3>
          <form onSubmit={createSafeZone}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="form-group">
                <label>Zone Name</label>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Radius (meters)</label>
                <input
                  type="number"
                  value={newZone.radius}
                  onChange={(e) => setNewZone({ ...newZone, radius: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newZone.lat}
                  onChange={(e) => setNewZone({ ...newZone, lat: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newZone.lng}
                  onChange={(e) => setNewZone({ ...newZone, lng: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Safe Zone</button>
          </form>
        </div>
        
        <div className="card">
          <h3>Safe Zones</h3>
          {safeZones.length === 0 ? (
            <p>No safe zones created</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Center</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Radius</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeZones.map((zone) => (
                  <tr key={zone._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{zone.name}</td>
                    <td style={{ padding: '10px' }}>
                      {zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}
                    </td>
                    <td style={{ padding: '10px' }}>{zone.radius}m</td>
                    <td style={{ padding: '10px' }}>
                      <button 
                        onClick={() => deleteSafeZone(zone._id)} 
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="card">
          <h3>Incidents (Blockchain Records)</h3>
          {incidents.length === 0 ? (
            <p>No incidents recorded</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className={`alert ${incident.resolved ? 'alert-success' : 'alert-warning'}`}
                  style={{ marginBottom: '10px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <strong>Incident #{incident.id}</strong>
                      <p>Tourist: {incident.touristAddress?.substring(0, 15)}...</p>
                      <p>Type: {incident.incidentType}</p>
                      <p>Location: {incident.location}</p>
                      <p>Time: {new Date(Number(incident.timestamp) * 1000).toLocaleString()}</p>
                      <p>Description: {incident.description}</p>
                      <p>Status: {incident.resolved ? '✓ Resolved' : '⚠ Pending'}</p>
                    </div>
                    {!incident.resolved && (
                      <button 
                        onClick={() => resolveIncident(incident.id)}
                        className="btn btn-success"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="card">
          <h3>Registered Tourists</h3>
          {tourists.length === 0 ? (
            <p>No tourists registered</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {tourists.map((tourist) => (
                  <tr key={tourist._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{tourist.name}</td>
                    <td style={{ padding: '10px' }}>{tourist.email}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`status-badge status-${tourist.safetyStatus}`}>
                        {tourist.safetyStatus}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {tourist.currentLocation ? 
                        `${tourist.currentLocation.lat.toFixed(4)}, ${tourist.currentLocation.lng.toFixed(4)}` 
                        : 'Not available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
