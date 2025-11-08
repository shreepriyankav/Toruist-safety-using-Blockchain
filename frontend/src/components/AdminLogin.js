import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userData', JSON.stringify(response.data.admin));
      
      onLogin('admin');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="alert alert-warning" style={{ fontSize: '12px' }}>
          Default credentials:<br />
          Email: admin@tourist.com<br />
          Password: admin123
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login as Admin
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login">Tourist Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
