# Setting Up Your Twilio Number (+18783329775) with Vapi

## Quick Steps

### Step 1: Import Your Twilio Number to Vapi

1. **Go to Vapi Dashboard**
   - Visit: https://dashboard.vapi.ai
   - Log in to your account

2. **Navigate to Phone Numbers**
   - Click on "Phone Numbers" in the sidebar
   - Or go directly to: https://dashboard.vapi.ai/phone-numbers

3. **Import from Twilio**
   - Click the **"Create Phone Number"** or **"Import"** button
   - Select **"Import from Twilio"** option
   - You'll need to provide:
     - Your Twilio Account SID
     - Your Twilio Auth Token
     - The phone number: `+18783329775`

4. **Get Your Phone Number ID**
   - After importing, Vapi will show your phone number
   - Click on the number to view details
   - Copy the **Phone Number ID** (it will look like: `abc123-def456-ghi789` or a UUID)

### Step 2: Get Your Twilio Credentials

You'll need these from your Twilio Console:

1. **Go to Twilio Console**
   - Visit: https://console.twilio.com
   - Log in to your account

2. **Get Account SID**
   - On the dashboard homepage, you'll see your **Account SID**
   - It starts with `AC` (e.g., `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

3. **Get Auth Token**
   - Click on your Account SID or go to Account Settings
   - Click "Show" next to Auth Token
   - Copy the **Auth Token** (it's a long string)

### Step 3: Update Your .env.local File

Add these lines to your `.env.local` file:

```env
# Twilio Configuration (for phone number +18783329775)
TWILIO_ACCOUNT_SID=your-twilio-account-sid-here
TWILIO_AUTH_TOKEN=your-twilio-auth-token-here

# Vapi Phone Number ID (after importing to Vapi)
VAPI_PHONE_NUMBER_ID=your-phone-number-id-from-vapi
```

**Important Notes:**
- Replace `your-twilio-account-sid-here` with your actual Twilio Account SID
- Replace `your-twilio-auth-token-here` with your actual Twilio Auth Token
- Replace `your-phone-number-id-from-vapi` with the Phone Number ID you copied from Vapi

### Step 4: Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop the server (Ctrl+C if running)
# Then restart:
npm run dev
```

## How It Works

Once configured, when someone uses your voice agent demo:

1. ✅ Your Twilio number (+18783329775) will be used as the **caller ID** (the number that appears on the recipient's phone)
2. ✅ Vapi will make the call using your imported Twilio number
3. ✅ The recipient will see your number calling them

## Troubleshooting

### If you can't import the number to Vapi:

**Option A: Use Twilio Credentials Directly**
- You can use your Twilio credentials without importing to Vapi
- Just add `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` to `.env.local`
- The code will automatically use your Twilio number

**Option B: Check Twilio Number Configuration**
- Make sure your Twilio number is active
- Verify it's not restricted in Twilio console
- Check that it has voice capabilities enabled

### If calls still don't work:

1. **Check Vapi Dashboard**
   - Verify the phone number is imported correctly
   - Check if there are any errors or restrictions

2. **Check Twilio Console**
   - Verify your account is active (not trial with restrictions)
   - Check geographic permissions if calling international numbers
   - Ensure you have sufficient credits

3. **Check Server Logs**
   - Look for error messages when making a call
   - The API route logs detailed information about each attempt

## Current Configuration Status

✅ **Already Set:**
- `VAPI_PRIVATE_KEY` - Configured
- `VAPI_AGENT_ID` - Configured

⏳ **Need to Add:**
- `TWILIO_ACCOUNT_SID` - Get from Twilio Console
- `TWILIO_AUTH_TOKEN` - Get from Twilio Console  
- `VAPI_PHONE_NUMBER_ID` - Get after importing to Vapi

## Next Steps

1. Import your Twilio number to Vapi dashboard
2. Copy the Phone Number ID from Vapi
3. Get your Twilio Account SID and Auth Token
4. Add all three to `.env.local`
5. Restart your dev server
6. Test the voice agent! 📞

