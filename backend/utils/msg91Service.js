const axios = require('axios');

const authKey = process.env.MSG91_AUTH_KEY;
const senderId = process.env.MSG91_SENDER_ID || 'TSAFTY';
const route = process.env.MSG91_ROUTE || '4'; // 4 = Transactional

async function sendSMS(location, touristName, touristId, coordinates) {
    const mobileNumber = process.env.ADMIN_PHONE_NUMBER;
    
    if (!authKey || !mobileNumber) {
        console.log('📱 MSG91 not configured. SMS would be sent:', {
            location: location.name,
            tourist: touristName,
            reason: location.restriction_reason
        });
        return { success: false, message: 'MSG91 not configured' };
    }

    // SMS message (160 characters max for single SMS)
    const message = `ALERT: Tourist ${touristName} entered restricted area ${location.name}, ${location.country}. Reason: ${location.restriction_reason}. Level: ${location.restriction_level}. Immediate action required.`;

    try {
        const url = `https://api.msg91.com/api/v5/flow/`;
        
        const response = await axios.post(url, {
            sender: senderId,
            route: route,
            country: '91',
            sms: [
                {
                    message: message,
                    to: [mobileNumber.replace('+91', '').replace('+', '')]
                }
            ]
        }, {
            headers: {
                'authkey': authKey,
                'content-type': 'application/json'
            }
        });

        console.log('✅ SMS sent successfully via MSG91!');
        console.log('   To:', mobileNumber);
        return { success: true, response: response.data };
    } catch (error) {
        console.error('❌ MSG91 SMS error:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendSMS };
