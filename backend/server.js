const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const touristRoutes = require('./routes/tourist');
const adminRoutes = require('./routes/admin');
const locationsRoutes = require('./routes/locations');

app.use('/api/auth', authRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Smart Tourist Safety Monitoring System API' });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('locationUpdate', (data) => {
        // Broadcast location update to admin dashboard
        io.emit('touristLocationUpdate', data);
    });
    
    socket.on('alertTriggered', (data) => {
        // Broadcast alert to all connected clients
        io.emit('newAlert', data);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Blockchain URL: ${process.env.BLOCKCHAIN_URL}`);
});

module.exports = { app, io };
