const mongoose = require('mongoose');
const blockchainUtils = require('./utils/blockchain');
require('dotenv').config();

const Tourist = require('./models/Tourist');

// Replace with your tourist's email
const TOURIST_EMAIL = 'admin@tourist.com'; // Change this to your email

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety')
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Find tourist
        const tourist = await Tourist.findOne({ email: TOURIST_EMAIL });
        
        if (!tourist) {
            console.error('❌ Tourist not found with email:', TOURIST_EMAIL);
            process.exit(1);
        }
        
        console.log('✅ Found tourist:', tourist.name);
        console.log('   Wallet:', tourist.walletAddress);
        
        // Register on blockchain
        try {
            console.log('📝 Registering on blockchain...');
            
            const result = await blockchainUtils.registerTourist(
                tourist.walletAddress,
                tourist.name,
                tourist.email,
                tourist.phoneNumber,
                tourist.privateKey
            );
            
            console.log('✅ Tourist registered on blockchain!');
            console.log('   TX Hash:', result.transactionHash);
            console.log('');
            console.log('🎉 Success! Now you can report incidents.');
            
        } catch (error) {
            console.error('❌ Blockchain registration failed:', error.message);
        }
        
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
