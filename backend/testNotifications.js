require('dotenv').config();
const axios = require('axios');

async function testFast2SMS() {
    console.log('\n🧪 Testing Fast2SMS...');
    const apiKey = process.env.FAST2SMS_API_KEY;
    const phone = process.env.ADMIN_PHONE_NUMBER;
    
    if (!apiKey) {
        console.log('❌ FAST2SMS_API_KEY not set');
        return;
    }
    
    console.log('   API Key:', apiKey.substring(0, 10) + '...');
    console.log('   Phone:', phone);
    
    try {
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: apiKey,
                route: 'q',
                message: 'Test message from Tourist Safety System',
                language: 'english',
                flash: 0,
                numbers: phone
            }
        });
        
        console.log('✅ Response:', response.data);
    } catch (error) {
        console.log('❌ Error:', error.response?.data || error.message);
    }
}

async function testTelegram() {
    console.log('\n🧪 Testing Telegram...');
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token) {
        console.log('❌ TELEGRAM_BOT_TOKEN not set');
        return;
    }
    
    console.log('   Token:', token.substring(0, 15) + '...');
    console.log('   Chat ID:', chatId);
    
    try {
        const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: '🧪 Test message from Tourist Safety System'
        });
        
        console.log('✅ Message sent! ID:', response.data.result.message_id);
    } catch (error) {
        console.log('❌ Error:', error.response?.data || error.message);
    }
}

async function runTests() {
    await testFast2SMS();
    console.log('\n✅ Tests complete!\n');
}

runTests();
