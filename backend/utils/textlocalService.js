const axios = require('axios');

const apiKey = process.env.TEXTLOCAL_API_KEY;

async function sendRealSMS(location, touristName, touristId, coordinates) {
    const mobileNumber = process.env.ADMIN_PHONE_NUMBER;
    
    if (!apiKey || !mobileNumber) {
        console.log('📱 TextLocal not configured');
        return { success: false, message: 'TextLocal not configured' };
    }

    const message = `ALERT: Tourist ${touristName} entered ${location.name}, ${location.country}. ${location.restriction_reason}. Level: ${location.restriction_level}. Action required!`;

    try {
        const response = await axios.post('https://api.textlocal.in/send/', null, {
            params: {
                apikey: apiKey,
                numbers: mobileNumber,
                message: message,
                sender: 'TXTLCL'
            }
        });

        if (response.data.status === 'success') {
            console.log('✅ Real SMS sent via TextLocal!');
            console.log('   To:', mobileNumber);
            console.log('   Message ID:', response.data.messages[0].id);
            return { success: true, messageId: response.data.messages[0].id };
        } else {
            console.error('❌ TextLocal error:', response.data.errors);
            return { success: false, error: response.data.errors };
        }
    } catch (error) {
        console.error('❌ TextLocal error:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendRealSMS };
