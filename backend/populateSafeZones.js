const mongoose = require('mongoose');
require('dotenv').config();

const SafeZone = require('./models/SafeZone');

const safeZones = [
    { name: 'Coimbatore City', center: { lat: 11.0168, lng: 76.9558 }, radius: 3000 },
    { name: 'Ooty Hill Station', center: { lat: 11.4102, lng: 76.6950 }, radius: 3000 },
    { name: 'Marudhamalai Temple', center: { lat: 11.0494, lng: 76.8686 }, radius: 3000 },
    { name: 'Valparai', center: { lat: 10.3270, lng: 76.9550 }, radius: 3000 },
    { name: 'Kodaikanal', center: { lat: 10.2381, lng: 77.4892 }, radius: 3000 }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety')
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Clear existing zones
        await SafeZone.deleteMany({});
        console.log('✅ Cleared old safe zones');
        
        // Insert new zones
        await SafeZone.insertMany(safeZones);
        console.log('✅ Created 5 safe zones:');
        safeZones.forEach(zone => console.log(`   - ${zone.name}`));
        
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
