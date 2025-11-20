# 🚀 Deployment Guide for VAWCOM Website

Complete guide for deploying to Hostinger or any production environment.

---

## ✅ Step 1: Create Production Environment File

Create a `.env.production` file in your project root with the following content:

```env
# ============================================
# VAWCOM Production Environment Variables
# ============================================
# ⚠️ IMPORTANT: Replace all xxxxx with your actual values
# ⚠️ NEVER commit this file to GitHub or any public repository
# ============================================

# ============================================
# AI Chatbot Configuration
# ============================================
# Priority: Gemini > OpenAI > Predefined responses

# Google Gemini API (Recommended - Free tier available)
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=xxxxx

# OpenAI API (Optional - Fallback)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=xxxxx

# ============================================
# Vapi Configuration (Voice Agent)
# ============================================
# Get your keys from: https://dashboard.vapi.ai
# Use either VAPI_PRIVATE_KEY (recommended) OR VAPI_PUBLIC_KEY
VAPI_PRIVATE_KEY=xxxxx
# OR use public key instead:
# VAPI_PUBLIC_KEY=xxxxx

# Vapi Agent ID (required for voice calls)
# Get from: https://dashboard.vapi.ai/assistants
VAPI_AGENT_ID=xxxxx

# Vapi Phone Number ID (optional)
# Get after importing your Twilio number to Vapi dashboard
# If not set, Vapi will use default free number (10 calls/day, US/Canada only)
VAPI_PHONE_NUMBER_ID=xxxxx

# ============================================
# Twilio Configuration (Voice Calls)
# ============================================
# Get from: https://console.twilio.com
# Required if using Twilio phone numbers with Vapi
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx

# Your Twilio phone number (E.164 format, e.g., +18783329775)
# This will be used as the caller ID
TWILIO_PHONE_NUMBER=+18783329775

# ============================================
# Email Configuration (Contact Form)
# ============================================
# Option 1: SMTP (Primary - Recommended)
# For Gmail: Use App Password (not regular password)
# Enable 2FA and create App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxxx
SMTP_FROM=your-email@gmail.com

# Option 2: Resend (Fallback)
# Get API key from: https://resend.com/api-keys
# Only needed if SMTP is not configured
RESEND_API_KEY=xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Contact form recipient email
# Where contact form submissions will be sent
CONTACT_EMAIL=vawcomtechnologies@gmail.com

# ============================================
# Application Configuration
# ============================================
# Your production domain URL (e.g., https://yourdomain.com)
# Used for API calls and absolute URLs
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Quick Command to Create the File:

```bash
# On Mac/Linux
touch .env.production

# Then edit it with your preferred editor
nano .env.production
# or
code .env.production
```

---

## ✅ Step 2: Verify Package.json Scripts

Make sure your `package.json` has these scripts (already configured):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

These are **mandatory** for Hostinger deployment.

---

## ✅ Step 3: Build Your Project Locally (Recommended)

Test the build before deploying:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally (optional)
npm run start
```

**Important**: Make sure no errors occur during the build process. Fix any errors before deploying.

---

## ✅ Step 4: Upload Code to Hostinger

You have two options:

### Option A: Upload via File Manager

1. **Compress your project** (excluding node_modules and .next):
   ```bash
   # Create a zip file excluding unnecessary files
   zip -r tech-startup-deploy.zip . \
     -x "node_modules/*" \
     -x ".next/*" \
     -x ".git/*" \
     -x "*.log" \
     -x ".DS_Store"
   ```

2. **Upload to Hostinger**:
   - Log in to Hostinger control panel
   - Go to File Manager
   - Navigate to your domain's public_html folder
   - Upload the zip file
   - Extract it

3. **Set Environment Variables**:
   - In Hostinger control panel, go to **Environment Variables** or **.env** settings
   - Add all variables from `.env.production`
   - OR upload `.env.production` file directly (rename to `.env` if needed)

4. **Install Dependencies**:
   - Use Hostinger's terminal/SSH access
   - Navigate to your project directory
   - Run: `npm install --production`

5. **Build the Project**:
   - Run: `npm run build`

6. **Start the Server**:
   - Run: `npm run start`
   - Or configure PM2/process manager for auto-restart

### Option B: Deploy via Git (Recommended)

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect Hostinger to Git**:
   - In Hostinger control panel, go to **Git** settings
   - Connect your repository
   - Set build command: `npm run build`
   - Set start command: `npm run start`
   - Set Node.js version (18.x or 20.x recommended)

3. **Set Environment Variables**:
   - Add all environment variables in Hostinger's environment settings
   - These will be available during build and runtime

---

## ✅ Step 5: Configure Hostinger Settings

### Node.js Version
- Use Node.js 18.x or 20.x (LTS versions)
- Set in Hostinger control panel → Node.js settings

### Environment Variables
Add all variables from `.env.production` in Hostinger's environment variables section:
- `OPENAI_API_KEY`
- `VAPI_PRIVATE_KEY` (or `VAPI_PUBLIC_KEY`)
- `VAPI_AGENT_ID`
- `VAPI_PHONE_NUMBER_ID` (optional)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `RESEND_API_KEY` (optional)
- `RESEND_FROM_EMAIL` (optional)
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_API_URL`

### Build Settings
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Output Directory**: `.next` (Next.js default)

---

## ✅ Step 6: Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads correctly
- [ ] All pages are accessible
- [ ] Contact form sends emails
- [ ] Chatbot responds (with or without OpenAI API key)
- [ ] Voice call feature works (if configured)
- [ ] Environment variables are set correctly
- [ ] No console errors in browser
- [ ] Mobile responsiveness works
- [ ] SSL certificate is active (HTTPS)

---

## 🔒 Security Checklist

- [ ] `.env.production` is NOT in Git (check `.gitignore`)
- [ ] All API keys are kept secure
- [ ] Environment variables are set in hosting panel (not in code)
- [ ] HTTPS is enabled
- [ ] Regular backups are configured

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 18.x or 20.x)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally first

### Environment Variables Not Working
- Verify variables are set in Hostinger control panel
- Check variable names match exactly (case-sensitive)
- Restart the application after adding variables

### Email Not Sending
- Verify SMTP credentials are correct
- For Gmail, use App Password (not regular password)
- Check SMTP port (587 for TLS, 465 for SSL)
- Test with Resend as fallback

### Voice Calls Not Working
- Verify Vapi API keys are correct
- Check VAPI_AGENT_ID is set
- Verify Twilio credentials if using Twilio numbers
- Check phone number format (E.164: +1234567890)

---

## 📝 Notes

1. **Never commit `.env.production`** to Git - it's already in `.gitignore`
2. **Use `.env.example`** as a template for team members
3. **Test locally** with `.env.local` before deploying
4. **Keep backups** of your environment variables securely
5. **Rotate API keys** periodically for security

---

## 🔗 Useful Links

- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **Vapi Dashboard**: https://dashboard.vapi.ai
- **Twilio Console**: https://console.twilio.com
- **Resend API**: https://resend.com/api-keys
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **Hostinger Support**: https://www.hostinger.com/contact

---

**Last Updated**: Based on current codebase
**Project**: VAWCOM Tech Startup Website


