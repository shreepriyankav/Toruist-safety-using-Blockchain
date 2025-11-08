# Twilio SMS Integration Guide
## Smart Tourist Safety Monitoring & Incident Response System

### System Overview
The system uses Twilio to send real-time SMS alerts to admin when tourists enter restricted/dangerous areas.

---

## Integration Steps

### Step 1: Update Environment Configuration

Edit `backend/.env` with Priyanka's Twilio credentials:

```env
# Twilio SMS Configuration (Priyanka's Account)
TWILIO_ACCOUNT_SID=AC********************************    # From Twilio Console
TWILIO_AUTH_TOKEN=********************************      # From Twilio Console
TWILIO_PHONE_NUMBER=+1**********                        # Twilio Active Number
ADMIN_PHONE_NUMBER=+919092559453                        # Admin's verified number
```

### Step 2: Verify Admin Phone Number in Twilio

**Important**: Trial accounts can only send SMS to verified numbers.

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click **"+ Add a new Caller ID"**
3. Select **India (+91)**
4. Enter: **9092559453**
5. Choose verification method: **"Text me"** or **"Call me"**
6. Enter the verification code received
7. Click **"Submit"**

### Step 3: Restart Backend Server

```bash
cd E:\blockchain\backend
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
Blockchain URL: http://127.0.0.1:7545
✅ Twilio SMS service initialized successfully
```

---

## How SMS Alerts Work

### Trigger Conditions:
- Tourist enters within **5km radius** of restricted area
- Restricted areas include:
  - 🚨 Mount Everest Base Camp (Nepal)
  - ☢️ Chernobyl Exclusion Zone (Ukraine)
  - 🚫 North Sentinel Island (India)
  - 🚫 Area 51 (USA)
  - ☢️ Fukushima Exclusion Zone (Japan)
  - 🐍 Snake Island (Brazil)
  - And more...

### SMS Alert Format:
```
⚠️ Alert: Tourist [Name] (ID: [Tourist_ID]) has entered a restricted area — [Location Name], [Country].
Reason: [Restriction Reason]
Level: [High/Medium/Low]
Coordinates: [Latitude], [Longitude]
Immediate attention required.
```

### Example SMS:
```
⚠️ Alert: Tourist John Doe (ID: 507f1f77bcf86cd799439011) has entered a restricted area — Mount Everest Base Camp, Nepal.
Reason: High altitude danger zone, requires climbing permit and guide
Level: High
Coordinates: 28.0026, 86.8528
Immediate attention required.
```

---

## System Flow

```
Tourist Enters Restricted Area
         ↓
System Detects (5km radius check)
         ↓
┌────────────────────────────────────┐
│  Immediate Actions:                 │
│  1. Play 2-second beep on device   │
│  2. Show browser alert popup       │
│  3. Send SMS to admin via Twilio   │
│  4. Record incident on blockchain  │
│  5. Update safety status to DANGER │
└────────────────────────────────────┘
         ↓
Admin Receives SMS on +919092559453
         ↓
Admin Checks Dashboard for Details
         ↓
Admin Resolves Incident
```

---

## Testing the Integration

### Test 1: Restricted Area Entry

1. **Start System:**
   - Ganache running
   - Backend: `npm start` in `backend/`
   - Frontend: `npm start` in `frontend/`

2. **Login as Tourist:**
   - Go to: `http://localhost:3000`
   - Register/Login

3. **Trigger Alert:**
   - Select from dropdown: **"🚨 Mount Everest Base Camp (Nepal)"**
   - System will:
     - ✅ Play beep sound
     - ✅ Show alert popup
     - ✅ Send SMS to +919092559453
     - ✅ Record on blockchain

4. **Verify SMS Delivery:**
   - Check phone: +919092559453
   - SMS should arrive within 10 seconds
   - Check Twilio logs: https://console.twilio.com/us1/monitor/logs/sms

### Test 2: Check Backend Logs

Backend console will show:
```
✅ SMS Alert sent successfully to +919092559453
   Message SID: SM********************************
   Location: Mount Everest Base Camp, Nepal
   Tourist: John Doe
```

Or if failed:
```
❌ SMS send error: [Error details]
```

### Test 3: Verify Blockchain Record

1. Login as admin: `http://localhost:3000/admin/login`
2. Check "Incidents (Blockchain Records)" section
3. Verify incident details:
   - Type: `restricted_area_entry`
   - Location coordinates
   - Timestamp
   - Transaction hash

---

## Troubleshooting

### Issue 1: SMS Not Received

**Check:**
- [ ] Admin number (+919092559453) verified in Twilio
- [ ] Twilio credentials correct in `.env`
- [ ] Backend restarted after updating `.env`
- [ ] Twilio account has credit balance
- [ ] Check Twilio logs for delivery status

**Solution:**
```bash
# Verify credentials
cd E:\blockchain\backend
cat .env | grep TWILIO

# Restart backend
npm start
```

### Issue 2: "accountSid must start with AC" Error

**Cause:** Invalid Account SID in `.env`

**Solution:**
- Ensure Account SID starts with `AC`
- Copy exact value from Twilio console
- No extra spaces or quotes

### Issue 3: SMS Shows "Sent from trial account"

**Cause:** Using Twilio trial account

**Solution:**
- This is normal for trial accounts
- Upgrade to paid account to remove message
- Or continue with trial (works perfectly)

### Issue 4: "Unverified number" Error

**Cause:** Admin number not verified in Twilio

**Solution:**
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Add and verify +919092559453
3. Retry sending SMS

---

## API Endpoint for SMS Testing

### Manual SMS Test (Optional)

Create test endpoint in `backend/routes/admin.js`:

```javascript
router.post('/test-sms', verifyToken, async (req, res) => {
    const { sendSMSAlert } = require('../utils/smsService');
    
    const testLocation = {
        name: 'Test Restricted Area',
        country: 'Test Country',
        restriction_reason: 'Testing SMS functionality',
        restriction_level: 'High'
    };
    
    const result = await sendSMSAlert(
        testLocation,
        'Test Tourist',
        'TEST123',
        { lat: 28.0026, lng: 86.8528 }
    );
    
    res.json(result);
});
```

Test with:
```bash
curl -X POST http://localhost:5000/api/admin/test-sms \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Configuration Checklist

- [ ] Twilio Account SID added to `.env`
- [ ] Twilio Auth Token added to `.env`
- [ ] Twilio Phone Number added to `.env`
- [ ] Admin Phone Number (+919092559453) added to `.env`
- [ ] Admin number verified in Twilio console
- [ ] Backend restarted after configuration
- [ ] Test SMS sent successfully
- [ ] SMS received on admin phone
- [ ] Blockchain incident recorded
- [ ] Admin dashboard shows incident

---

## Production Deployment Notes

### For Production Use:

1. **Upgrade Twilio Account:**
   - Remove trial limitations
   - Send to any phone number
   - Remove "trial account" message

2. **Environment Variables:**
   - Use secure secret management
   - Never commit `.env` to git
   - Use different credentials per environment

3. **Rate Limiting:**
   - Implement SMS rate limiting
   - Prevent spam/abuse
   - Add cooldown period between alerts

4. **Error Handling:**
   - Retry failed SMS
   - Queue SMS for delivery
   - Alert admin if SMS fails

5. **Monitoring:**
   - Track SMS delivery rates
   - Monitor Twilio usage/costs
   - Set up alerts for failures

---

## Cost Estimation (Twilio Trial)

- **Free Credit:** $15
- **SMS Cost:** ~$0.0075 per SMS (India)
- **Estimated SMS:** ~2000 messages
- **Perfect for:** Testing and development

---

## Support & Resources

- **Twilio Console:** https://console.twilio.com
- **Twilio Docs:** https://www.twilio.com/docs/sms
- **SMS Logs:** https://console.twilio.com/us1/monitor/logs/sms
- **Verify Numbers:** https://console.twilio.com/us1/develop/phone-numbers/manage/verified

---

## Security Best Practices

1. **Never expose credentials:**
   - Keep `.env` file secure
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Validate phone numbers:**
   - Check format before sending
   - Verify numbers in Twilio console
   - Handle invalid numbers gracefully

3. **Rate limiting:**
   - Limit SMS per tourist per day
   - Prevent abuse/spam
   - Add cooldown between alerts

4. **Audit logging:**
   - Log all SMS attempts
   - Track delivery status
   - Monitor for suspicious activity

---

## Next Steps

1. Provide Twilio credentials
2. Update `.env` file
3. Verify admin phone number
4. Restart backend
5. Test restricted area entry
6. Verify SMS delivery
7. Check blockchain record
8. Review admin dashboard

Ready to integrate! Please provide the Twilio credentials.
