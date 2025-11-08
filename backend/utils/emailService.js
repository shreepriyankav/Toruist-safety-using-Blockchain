const nodemailer = require('nodemailer');

// Create email transporter
let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

async function sendEmailAlert(location, touristName, touristId, coordinates) {
    if (!transporter || !process.env.ADMIN_EMAIL) {
        console.log('📧 Email not configured. Alert would be sent:', {
            location: location.name,
            tourist: touristName,
            reason: location.restriction_reason
        });
        return { success: false, message: 'Email service not configured' };
    }

    const subject = `🚨 RESTRICTED AREA ALERT - ${location.name}`;
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc3545; border-radius: 10px;">
            <h2 style="color: #dc3545; text-align: center;">⚠️ RESTRICTED AREA ALERT ⚠️</h2>
            
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Tourist Information</h3>
                <p><strong>Name:</strong> ${touristName}</p>
                <p><strong>Digital ID:</strong> ${touristId}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Location Details</h3>
                <p><strong>Restricted Area:</strong> ${location.name}, ${location.country}</p>
                <p><strong>Region:</strong> ${location.region}</p>
                <p><strong>Coordinates:</strong> ${coordinates.lat}, ${coordinates.lng}</p>
            </div>
            
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Restriction Information</h3>
                <p><strong>Type:</strong> ${location.restriction_type}</p>
                <p><strong>Level:</strong> <span style="color: #dc3545; font-weight: bold;">${location.restriction_level}</span></p>
                <p><strong>Status:</strong> ${location.restriction_status}</p>
                <p><strong>Reason:</strong> ${location.restriction_reason}</p>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Official Source</h3>
                <p><a href="${location.official_source}" target="_blank">${location.official_source}</a></p>
                <p><strong>Last Verified:</strong> ${location.last_verified}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 15px; background: #dc3545; color: white; border-radius: 5px;">
                <h3 style="margin: 0;">⚠️ IMMEDIATE ATTENTION REQUIRED ⚠️</h3>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                This is an automated alert from Smart Tourist Safety Monitoring System<br>
                Powered by Blockchain & AI Technology
            </p>
        </div>
    `;

    const textContent = `
⚠️ RESTRICTED AREA ALERT ⚠️

Tourist: ${touristName} (ID: ${touristId})
Location: ${location.name}, ${location.country}
Coordinates: ${coordinates.lat}, ${coordinates.lng}

Restriction Type: ${location.restriction_type}
Level: ${location.restriction_level}
Status: ${location.restriction_status}
Reason: ${location.restriction_reason}

Official Source: ${location.official_source}
Last Verified: ${location.last_verified}

⚠️ IMMEDIATE ATTENTION REQUIRED ⚠️
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Tourist Safety System" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: subject,
            text: textContent,
            html: htmlContent
        });
        
        console.log('✅ Email alert sent successfully!');
        console.log('   Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendEmailAlert };
