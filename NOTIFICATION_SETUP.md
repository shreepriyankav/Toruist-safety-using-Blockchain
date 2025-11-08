# 📱 Notification Setup Guide

## Quick Fix Steps

### 1️⃣ Fast2SMS (Real SMS to Phone)

**Steps:**
1. Go to https://www.fast2sms.com/signup
2. Sign up with your email (no GST required)
3. Login and navigate to: **Dashboard → Dev API**
4. Copy your API Key (long string starting with letters)
5. Open `backend/.env` file
6. Paste API key: `FAST2SMS_API_KEY=YOUR_KEY_HERE`
7. Save file

**Test:**
```bash
cd backend
node testNotifications.js
```

---

### 2️⃣ Telegram Bot (Instant Alerts)

**Steps:**
1. Open Telegram app
2. Search for `@BotFather`
3. Send: `/newbot`
4. Follow prompts (name your bot)
5. Copy the **token** (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
6. Start a chat with your new bot (click the link BotFather gives you)
7. Send any message to your bot (e.g., "Hello")
8. Open browser: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - Replace `<YOUR_TOKEN>` with your actual token
9. Find `"chat":{"id":123456789}` in the response
10. Copy the chat ID number
11. Open `backend/.env` file:
    ```
    TELEGRAM_BOT_TOKEN=your_token_here
    TELEGRAM_CHAT_ID=your_chat_id_here
    ```
12. Save file

**Test:**
```bash
cd backend
node testNotifications.js
```

---

### 3️⃣ Email Alerts (Gmail)

**Steps:**
1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → type "Tourist Safety"
5. Click **Generate**
6. Copy the 16-character password (ignore spaces)
7. Open `backend/.env` file:
    ```
    EMAIL_USER=your.email@gmail.com
    EMAIL_PASS=abcd efgh ijkl mnop  (paste the 16-char password)
    ADMIN_EMAIL=your.email@gmail.com
    ```
8. Save file

**Test:**
```bash
cd backend
node testNotifications.js
```

---

## Current Issues

❌ **Fast2SMS 400 Error**: API key is invalid or expired
- **Fix**: Get fresh API key from Fast2SMS dashboard

❌ **Telegram 400 Error**: Bot token or chat ID is wrong
- **Fix**: Create new bot with @BotFather and get correct chat ID

❌ **Email Error**: Gmail credentials not configured
- **Fix**: Generate App Password from Google Account settings

---

## After Setup

1. **Test notifications:**
   ```bash
   cd backend
   node testNotifications.js
   ```

2. **Restart backend:**
   ```bash
   npm start
   ```

3. **Test in app:**
   - Login as tourist
   - Select a restricted location (e.g., "🏔️ Mount Everest Base Camp")
   - Click "Update Location"
   - You should receive: SMS + Telegram + Email alerts

---

## Priority Setup (Choose One)

If you only want **ONE** notification method working:

### Option A: Fast2SMS (Real SMS) ⭐ RECOMMENDED
- Delivers to phone's default SMS inbox
- FREE 50 SMS credits
- Setup time: 2 minutes

### Option B: Telegram (Instant)
- Free unlimited messages
- Requires Telegram app
- Setup time: 3 minutes

### Option C: Email (Reliable)
- Works with any email
- May go to spam folder
- Setup time: 2 minutes

---

## Troubleshooting

**Fast2SMS still fails?**
- Check if you have SMS credits left (Dashboard → Credits)
- Verify phone number format: `9092559453` (no +91)
- Try regenerating API key

**Telegram still fails?**
- Make sure you sent a message to your bot first
- Verify chat ID is a number, not a string
- Check token has no extra spaces

**Email still fails?**
- Enable 2-Step Verification first
- Use App Password, not regular password
- Check if "Less secure app access" is off (should be off)

---

## Need Help?

Run the test script to see detailed error messages:
```bash
cd backend
node testNotifications.js
```

The script will show exactly what's wrong with each service.
