const mongoose = require('mongoose');
require('dotenv').config();

const SafeZone = require('./models/SafeZone');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety')
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Delete all safe zones
        const result = await SafeZone.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} safe zones`);
        
        console.log('✅ All safe zones cleared!');
        console.log('You can now create new safe zones in the Coimbatore region through the admin dashboard.');
        
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
