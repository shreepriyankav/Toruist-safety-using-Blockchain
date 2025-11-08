const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const adminPhone = process.env.ADMIN_PHONE_NUMBER;

let client;
if (accountSid && authToken && accountSid.startsWith('AC')) {
  const twilio = require('twilio');
  client = twilio(accountSid, authToken);
}

async function sendSMSAlert(location, touristName, touristId, coordinates) {
  if (!client || !adminPhone) {
    console.log('SMS not configured. Alert would be sent:', {
      location: location.name,
      tourist: touristName,
      reason: location.restriction_reason
    });
    return { success: false, message: 'SMS service not configured' };
  }

  const message = `⚠️ Alert: Tourist ${touristName} (ID: ${touristId}) has entered a restricted area — ${location.name}, ${location.country}.\nReason: ${location.restriction_reason}\nLevel: ${location.restriction_level}\nCoordinates: ${coordinates.lat}, ${coordinates.lng}\nImmediate attention required.`;

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: adminPhone
    });
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSMSAlert };
