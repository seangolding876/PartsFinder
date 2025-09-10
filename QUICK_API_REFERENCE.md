# 🚀 Quick API Setup Reference

## 📌 Direct Links & Steps

### 1️⃣ **Stripe (5 minutes)**
1. **Get Keys**: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. **Copy these**:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
   STRIPE_SECRET_KEY = sk_live_...
   ```
3. **Enable JMD**: Settings → Currencies → Add JMD

### 2️⃣ **Cloudinary (3 minutes)**
1. **Sign up**: [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. **Get from Dashboard**:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = [your-cloud-name]
   CLOUDINARY_API_KEY = [shown in dashboard]
   CLOUDINARY_API_SECRET = [shown in dashboard]
   ```

### 3️⃣ **Resend (5 minutes)**
1. **Sign up**: [resend.com/signup](https://resend.com/signup)
2. **Create API Key**: [resend.com/api-keys](https://resend.com/api-keys)
3. **Add to Netlify**:
   ```
   RESEND_API_KEY = re_...
   FROM_EMAIL = notifications@partsfinda.com
   ```

### 4️⃣ **Add to Netlify (2 minutes)**
1. **Go to**: [app.netlify.com](https://app.netlify.com) → Your Site
2. **Navigate**: Site configuration → Environment variables
3. **Add each key**: Click "Add a variable"
4. **Save & Redeploy**: Click "Save" → Trigger deploy

---

## ✅ Copy-Paste Template for Netlify

```env
# Production API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_YOUR_KEY_HERE
FROM_EMAIL=notifications@partsfinda.com

# Keep these as-is (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://wdqkmxywspgibgkekvvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcWtteHl3c3BnaWJna2VrdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzQ0MjgsImV4cCI6MjA1MTUxMDQyOH0.t79GAa9etmlr4w1YuXJzMjBCJn5vGzjwIMpEcISwJxE
NEXT_PUBLIC_SITE_URL=https://partsfinda.com
```

---

## 🧪 Quick Test Commands

After adding keys and redeploying, test each service:

### Test Payment (Browser Console)
```javascript
// Should return: {success: true, clientSecret: "..."}
fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    amount: 15500,
    currency: 'jmd',
    customerInfo: {email: 'test@test.com', firstName: 'Test', lastName: 'User'},
    items: [{id: '1', name: 'Part', price: 100, quantity: 1}]
  })
}).then(r => r.json()).then(console.log)
```

### Test Email
```javascript
// Should return: {success: true, message: "Notification sent"}
fetch('/api/notifications', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    type: 'part_request',
    to: 'admin@partsfinda.com',
    subject: 'Test',
    data: {partName: 'Test', customerName: 'Test'}
  })
}).then(r => r.json()).then(console.log)
```

---

## ⚡ 15-Minute Setup Timeline

| Time | Task |
|------|------|
| 0-5 min | Create Stripe account & get keys |
| 5-8 min | Create Cloudinary account & get keys |
| 8-13 min | Create Resend account & get keys |
| 13-15 min | Add all keys to Netlify & redeploy |

---

## 🔴 Important Notes

1. **Use LIVE keys**, not test keys (live keys start with `pk_live_` and `sk_live_`)
2. **Redeploy required** after adding environment variables
3. **Domain verification** needed for Resend (may take 24-48 hours)
4. **Free tiers** sufficient for testing:
   - Resend: 100 emails/day
   - Cloudinary: 25GB bandwidth/month
   - Stripe: No monthly fee, 2.9% + 30¢ per transaction

---

**Need help?** Contact admin@partsfinda.com
