const axios = require('axios');

const apiKey = process.env.FAST2SMS_API_KEY;

async function sendRealSMS(location, touristName, touristId, coordinates) {
    const mobileNumber = process.env.ADMIN_PHONE_NUMBER;
    
    if (!apiKey || !mobileNumber) {
        console.log('📱 Fast2SMS not configured. SMS would be sent:', {
            location: location.name,
            tourist: touristName,
            reason: location.restriction_reason
        });
        return { success: false, message: 'Fast2SMS not configured' };
    }

    // SMS message (160 characters for single SMS)
    const message = `ALERT: Tourist ${touristName} entered ${location.name}, ${location.country}. ${location.restriction_reason}. Level: ${location.restriction_level}. Action required!`;

    try {
        const url = 'https://www.fast2sms.com/dev/bulkV2';
        
        const response = await axios.get(url, {
            params: {
                authorization: apiKey,
                route: 'q',  // Quick transactional route
                message: message,
                language: 'english',
                flash: 0,
                numbers: mobileNumber.replace('+91', '').replace('+', '')
            }
        });

        if (response.data.return === true) {
            console.log('✅ Real SMS sent successfully via Fast2SMS!');
            console.log('   To: +91' + mobileNumber.replace('+91', '').replace('+', ''));
            console.log('   Message ID:', response.data.message_id);
            return { success: true, messageId: response.data.message_id };
        } else {
            console.error('❌ Fast2SMS error:', response.data.message);
            return { success: false, error: response.data.message };
        }
    } catch (error) {
        console.error('❌ Fast2SMS error:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendRealSMS };
