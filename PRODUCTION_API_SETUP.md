# 🔐 Production API Configuration Guide for PartsFinda

## Overview
This guide will help you configure real API keys for production services in your Netlify deployment.

---

## 📋 Required Services & API Keys

### 1. **Stripe (Payment Processing)**
- **Purpose**: Handle secure payment processing for parts purchases
- **Required Keys**:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Public)
  - `STRIPE_SECRET_KEY` (Secret)

### 2. **Cloudinary (Image Management)**
- **Purpose**: Upload and manage part images from sellers
- **Required Keys**:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (Public)
  - `CLOUDINARY_API_KEY` (Secret)
  - `CLOUDINARY_API_SECRET` (Secret)

### 3. **Resend (Email Notifications)**
- **Purpose**: Send transactional emails for part requests and quotes
- **Required Keys**:
  - `RESEND_API_KEY` (Secret)
  - `FROM_EMAIL` (Configuration)

---

## 🚀 Step-by-Step Configuration

### Step 1: Obtain API Keys

#### **Stripe Setup**
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up or log in to your account
3. Navigate to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key**: `pk_live_...` (starts with pk_live)
   - **Secret key**: `sk_live_...` (starts with sk_live)
5. **Important**: Enable these features in Stripe:
   - Payment Methods: Cards, Bank transfers
   - Currency: JMD (Jamaican Dollar)
   - Webhook endpoint: `https://partsfinda.com/api/webhooks/stripe`

#### **Cloudinary Setup**
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (10GB storage included)
3. From your dashboard, copy:
   - **Cloud Name**: Your unique cloud name
   - **API Key**: Found in Dashboard → Account Details
   - **API Secret**: Found in Dashboard → Account Details
4. Configure settings:
   - Enable unsigned uploads for user convenience
   - Set up upload presets for part images
   - Configure transformations for thumbnails

#### **Resend Setup**
1. Go to [https://resend.com](https://resend.com)
2. Sign up for an account (100 emails/day free)
3. Verify your domain: `partsfinda.com`
4. Create an API key:
   - Go to **API Keys** → **Create API Key**
   - Name: "PartsFinda Production"
   - Copy the key (shown only once!)
5. Configure:
   - Add sending domain: `partsfinda.com`
   - Set up SPF, DKIM, and DMARC records
   - Create email template for notifications

---

## 🔧 Step 2: Add Keys to Netlify

### Method 1: Via Netlify Dashboard (Recommended)

1. **Log in to Netlify**:
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Select your `partsfinda` site

2. **Navigate to Environment Variables**:
   - Click **Site configuration** → **Environment variables**
   - Or go to: **Site settings** → **Environment variables**

3. **Add Production Keys**:
   Click "Add a variable" for each:

   ```bash
   # Stripe (Production)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_51...
   STRIPE_SECRET_KEY = sk_live_51...
   STRIPE_WEBHOOK_SECRET = whsec_... (optional but recommended)

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = 123456789012345
   CLOUDINARY_API_SECRET = AbC-dEfGhIjKlMnOpQrStUvWxYz
   CLOUDINARY_URL = cloudinary://API_KEY:API_SECRET@CLOUD_NAME

   # Resend
   RESEND_API_KEY = re_AbCdEfGh_1234567890
   FROM_EMAIL = notifications@partsfinda.com
   REPLY_TO_EMAIL = support@partsfinda.com

   # Optional: Analytics
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX (Google Analytics)
   ```

4. **Set Scope**:
   - Choose "All deploys" for production values
   - Or use "Specific branches" for staging/dev

5. **Save & Redeploy**:
   - Click "Save"
   - Trigger a new deployment for changes to take effect

### Method 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set STRIPE_SECRET_KEY "sk_live_..."
netlify env:set RESEND_API_KEY "re_..."
netlify env:set CLOUDINARY_API_SECRET "..."

# Trigger redeploy
netlify deploy --prod
```

---

## 🔒 Security Best Practices

### DO's ✅
- **Keep secret keys secret**: Never commit them to Git
- **Use environment variables**: Always use process.env
- **Rotate keys regularly**: Every 90 days minimum
- **Monitor usage**: Set up alerts for unusual activity
- **Use webhook signatures**: Verify Stripe webhook authenticity
- **Enable 2FA**: On all service accounts
- **Restrict API key permissions**: Use minimum required scopes

### DON'Ts ❌
- **Never expose secret keys** in client-side code
- **Don't use test keys** in production
- **Avoid hardcoding** keys in source files
- **Don't share keys** via email or chat
- **Never commit** .env files to repository

---

## 📊 Testing Your Configuration

### 1. **Test Stripe Integration**
```javascript
// Test payment in browser console
fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 15500, // J$155.00 in cents
    currency: 'jmd',
    customerInfo: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    },
    items: [{ id: '1', name: 'Test Part', price: 100, quantity: 1 }]
  })
}).then(r => r.json()).then(console.log)
```

### 2. **Test Email Sending**
```javascript
// Test email notification
fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'part_request',
    to: 'admin@partsfinda.com',
    subject: 'Test Email',
    data: {
      partName: 'Test Part',
      customerName: 'Test User'
    }
  })
}).then(r => r.json()).then(console.log)
```

### 3. **Test Image Upload**
```javascript
// Test Cloudinary configuration
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('upload_preset', 'partsfinda');

fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
  method: 'POST',
  body: formData
}).then(r => r.json()).then(console.log)
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Check for extra spaces, ensure using live keys |
| "Payment failed" | Verify Stripe account is activated for live payments |
| "Email not sending" | Confirm domain verification in Resend |
| "Image upload failed" | Check Cloudinary quota and upload preset |
| "Environment variable undefined" | Redeploy after adding variables |

### Debug Checklist
- [ ] All environment variables added to Netlify?
- [ ] Site redeployed after adding variables?
- [ ] Using production (live) keys, not test keys?
- [ ] Domain verified for email sending?
- [ ] API services activated and not rate-limited?
- [ ] Webhook endpoints configured correctly?

---

## 📞 Support Contacts

- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Cloudinary Support**: [https://support.cloudinary.com](https://support.cloudinary.com)
- **Resend Support**: [https://resend.com/support](https://resend.com/support)
- **Netlify Support**: [https://www.netlify.com/support](https://www.netlify.com/support)
- **PartsFinda Support**: admin@partsfinda.com

---

## 🎯 Final Checklist

Before going live, ensure:

- [ ] All API keys are production keys (not test)
- [ ] Environment variables set in Netlify dashboard
- [ ] Site redeployed with new variables
- [ ] Payment processing tested with real card
- [ ] Email notifications working
- [ ] Image uploads functioning
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Monitoring and alerts set up
- [ ] Backup of all API keys stored securely

---

## 📝 Notes

- **Stripe Test Cards**: Use `4242 4242 4242 4242` for testing
- **JMD Currency**: Stripe supports JMD directly
- **Email Limits**: Resend free tier = 100 emails/day
- **Image Storage**: Cloudinary free = 25GB bandwidth/month
- **Monitoring**: Set up Netlify Analytics for traffic insights

---

*Last Updated: January 2024*
*For PartsFinda Marketplace v1.0*
