const mongoose = require('mongoose');
require('dotenv').config();

const Tourist = require('./models/Tourist');
const SafeZone = require('./models/SafeZone');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety')
    .then(async () => {
        console.log('Connected to MongoDB');
        console.log('');
        
        // Delete all tourists
        const touristResult = await Tourist.deleteMany({});
        console.log(`✅ Deleted ${touristResult.deletedCount} tourists`);
        
        // Delete all safe zones
        const zoneResult = await SafeZone.deleteMany({});
        console.log(`✅ Deleted ${zoneResult.deletedCount} safe zones`);
        
        console.log('');
        console.log('🎉 Database cleaned successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Run: node populateSafeZones.js (to create 5 safe zones)');
        console.log('2. Register a new tourist account');
        console.log('3. Test the system');
        
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
