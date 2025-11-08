const axios = require('axios');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(location, touristName, touristId, coordinates) {
    if (!botToken || !chatId) {
        console.log('📱 Telegram not configured. Alert would be sent:', {
            location: location.name,
            tourist: touristName,
            reason: location.restriction_reason
        });
        return { success: false, message: 'Telegram service not configured' };
    }

    const message = `
🚨 *RESTRICTED AREA ALERT* 🚨

👤 *Tourist Information*
• Name: ${touristName}
• Digital ID: \`${touristId}\`

📍 *Location Details*
• Area: *${location.name}*
• Country: ${location.country}
• Region: ${location.region}
• Coordinates: \`${coordinates.lat}, ${coordinates.lng}\`

⚠️ *Restriction Information*
• Type: ${location.restriction_type}
• Level: *${location.restriction_level}*
• Status: ${location.restriction_status}
• Reason: ${location.restriction_reason}

🔗 *Official Source*
${location.official_source}

📅 Last Verified: ${location.last_verified}

⚠️ *IMMEDIATE ATTENTION REQUIRED* ⚠️
    `.trim();

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });

        console.log('✅ Telegram alert sent successfully!');
        console.log('   Message ID:', response.data.result.message_id);
        return { success: true, messageId: response.data.result.message_id };
    } catch (error) {
        console.error('❌ Telegram send error:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendTelegramAlert };
