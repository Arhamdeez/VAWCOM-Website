# Vapi Integration - Complete Setup Guide

## What You Already Have ✅

1. **API Route**: Created and working ✓
2. **Frontend Demo**: Connected to API ✓

## What You Need 🔑

### 1. Get Your Agent ID (Assistant ID)

**This is REQUIRED** - Vapi needs this to know which AI agent to use for calls.

#### Steps to Get Agent ID:

1. **Go to Vapi Dashboard**
   - Visit: https://dashboard.vapi.ai
   - Log in with your Vapi account

2. **Navigate to Agents Section**
   - Look for "Agents" or "Assistants" in the sidebar
   - You should see a list of your agents

3. **Find Your Agent**
   - Locate the agent you want to use for calls
   - Click on it to open details

4. **Copy the Agent ID**
   - The Agent ID will look something like: `abc123-def456-ghi789`
   - It might be labeled as:
     - "Agent ID"
     - "Assistant ID"
     - "ID"
     - Or just shown as a UUID/string

### 2. Set Up Environment Variables

1. **Create/Edit `.env.local` file** in your project root:
   ```
   /Users/app/CascadeProjects/tech-startup/.env.local
   ```

2. **Add these lines**:
   ```env
   VAPI_PRIVATE_KEY=your-vapi-private-key-here
   VAPI_AGENT_ID=your-agent-id-here
   ```
   Replace `your-vapi-private-key-here` with your actual Vapi private key, and `your-agent-id-here` with the actual Agent ID you copied.

### 3. Restart Your Dev Server

After adding the Agent ID:

1. **Stop the current server** (if running)
   - Press `Ctrl+C` in the terminal

2. **Start it again**:
   ```bash
   npm run dev
   ```

3. **Verify it's running** on http://localhost:3000

### 4. Test the Integration

1. **Go to your website**: http://localhost:3000
2. **Navigate to Services section** (Voice Agent Demo)
3. **Enter your phone number**: `+923244200101` (or any valid number)
4. **Click "Start Demo Call"**
5. **You should receive a call** from your Vapi agent!

## Troubleshooting

### If you get "Agent ID required" error:
- ✅ Check that `.env.local` exists in project root
- ✅ Verify `VAPI_AGENT_ID=your-actual-id` is set
- ✅ Make sure you restarted the server after adding it

### If calls don't work:
1. **Check server logs** - Look for:
   - `🤖 Agent ID: [your-id]` (should show your ID, not "Not provided")
   - Any error messages from Vapi

2. **Verify in Vapi Dashboard**:
   - Is your agent active/enabled?
   - Does your Vapi account have call credits?
   - Is your phone number verified (if required)?

3. **Check phone number format**:
   - Must be E.164 format: `+[country code][number]`
   - Example: `+923244200101` ✓
   - Example: `+15551234567` ✓

## What the Code Does Now

Once you add your Agent ID, the API will:

1. ✅ Use correct endpoint: `https://api.vapi.ai/call`
2. ✅ Send request with:
   ```json
   {
     "customer": {
       "number": "+923244200101"
     },
     "assistantId": "your-agent-id"
   }
   ```
3. ✅ Vapi initiates call to your number
4. ✅ Your phone receives call from Vapi agent

## Need Help Finding Your Agent ID?

If you can't find it in the dashboard:
1. Look for any "API" or "Integration" section
2. Check the URL when viewing an agent - it might show the ID
3. Try the Vapi documentation: https://docs.vapi.ai
4. Contact Vapi support if you're still stuck

## Summary Checklist

- [ ] Get Agent ID from Vapi dashboard
- [ ] Create `.env.local` file in project root
- [ ] Add `VAPI_PRIVATE_KEY` and `VAPI_AGENT_ID` to `.env.local`
- [ ] Restart dev server (`npm run dev`)
- [ ] Test with phone number in demo
- [ ] Receive call! 📞

