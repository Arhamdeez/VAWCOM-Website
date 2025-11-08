# Vapi Integration Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
VAPI_PRIVATE_KEY=your-vapi-private-key-here
# OR use public key instead:
# VAPI_PUBLIC_KEY=your-vapi-public-key-here
VAPI_AGENT_ID=your-vapi-agent-id-here
```

**Optional (if using Twilio for outbound calls):**
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
```

**Required for outbound calls:**
```env
VAPI_PHONE_NUMBER_ID=your-vapi-phone-number-id-here
```

## Setting Up Your Agent ID

1. Log into your Vapi dashboard at https://dashboard.vapi.ai
2. Navigate to your Agents section
3. Copy your Agent ID
4. Add it to your `.env.local` file as `VAPI_AGENT_ID`

## Setting Up a Phone Number (Required for Outbound Calls)

**IMPORTANT**: For outbound calls (calling users), you need a phone number configured in Vapi to use as the caller ID.

1. **Go to Phone Numbers section** in your Vapi dashboard (you're already there!)
2. **Click "Create Phone Number"** button
3. **Choose one of these options**:
   - **Create a free Vapi number** (easiest for testing)
   - **Import from Twilio** (if you have Twilio account)
   - **Import from Vonage** (if you have Vonage account)
4. **After creating/importing**, copy the **Phone Number ID**
5. **Add it to your `.env.local` file**:
   ```env
   VAPI_PHONE_NUMBER_ID=your-phone-number-id-here
   ```

**Why is this needed?**
- Vapi needs to know which phone number to use as the "from" number when making outbound calls
- You can either use a `phoneNumberId` (recommended) or provide the phone number directly

## How It Works

1. User enters their phone number in the Voice Agent Demo
2. The number is sent to `/api/vapi/call` endpoint
3. The API route:
   - Validates and formats the phone number to E.164 format
   - Uses your private key to authenticate with Vapi
   - Initiates an outbound call to the user's number
4. User receives a call from your Vapi agent

## Phone Number Format

The system automatically formats phone numbers to E.164 format:
- US numbers: `+15551234567` (10 digits → +1 prefix)
- International: Must include country code

## Testing

1. Make sure your `.env.local` file is configured
2. Restart your development server: `npm run dev`
3. Navigate to the Voice Agent Demo section
4. Enter a valid phone number and click "Start Demo Call"
5. You should receive a call from your Vapi agent

## Troubleshooting

- **"Failed to initiate call"**: Check that your private key and agent ID are correct
- **"Network error"**: Verify your internet connection and that Vapi API is accessible
- **No call received**: Check your Vapi dashboard for call logs and status

## Security Notes

- ✅ Private key is stored server-side only (never exposed to client)
- ✅ API calls are made from server-side route handler
- ✅ Phone numbers are validated before making API calls
- ⚠️ **IMPORTANT**: Never commit your `.env.local` file to version control
- ⚠️ **IMPORTANT**: Never hardcode API keys in your source code
- ⚠️ **IMPORTANT**: Always use environment variables for sensitive credentials

