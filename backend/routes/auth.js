const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tourist = require('../models/Tourist');
const Admin = require('../models/Admin');
const blockchainUtils = require('../utils/blockchain');

// Tourist Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        
        // Check if tourist already exists
        const existingTourist = await Tourist.findOne({ email });
        if (existingTourist) {
            return res.status(400).json({ message: 'Tourist already registered' });
        }
        
        // Create blockchain wallet
        const wallet = blockchainUtils.createWallet();
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create tourist in MongoDB
        const tourist = new Tourist({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            walletAddress: wallet.address
        });
        
        await tourist.save();
        
        // Store private key temporarily for blockchain registration
        tourist.privateKey = wallet.privateKey;
        
        // Register on blockchain
        try {
            console.log('📝 Registering tourist on blockchain...');
            console.log('Wallet:', wallet.address);
            console.log('Private Key:', wallet.privateKey.substring(0, 10) + '...');
            await blockchainUtils.registerTourist(wallet.address, name, email, phoneNumber, wallet.privateKey);
            console.log('✅ Tourist registered on blockchain successfully');
        } catch (blockchainError) {
            console.error('❌ Blockchain registration failed:', blockchainError.message);
            console.error('Full error:', blockchainError);
            // Continue anyway - tourist can still use the system
        }
        
        res.status(201).json({
            message: 'Tourist registered successfully',
            walletAddress: wallet.address,
            privateKey: wallet.privateKey
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Tourist Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const tourist = await Tourist.findOne({ email });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, tourist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: tourist._id, type: 'tourist' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            tourist: {
                id: tourist._id,
                name: tourist.name,
                email: tourist.email,
                walletAddress: tourist.walletAddress,
                safetyStatus: tourist.safetyStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        let admin = await Admin.findOne({ email });
        
        // Create default admin if not exists
        if (!admin && email === process.env.ADMIN_EMAIL) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            admin = new Admin({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                name: 'System Admin'
            });
            await admin.save();
        }
        
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: admin._id, type: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Admin login failed', error: error.message });
    }
});

module.exports = router;
