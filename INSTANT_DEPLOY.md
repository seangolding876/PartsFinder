# 🚀 Deploy PartsFinda to Netlify in 2 Minutes

## Option 1: Quick Deploy with Netlify Drop (Fastest)

1. **Build your site locally:**
```bash
cd partsfinda
bun install
bun run build
```

2. **Create deployment folder:**
```bash
cp -r .next partsfinda-deploy/
cp package.json partsfinda-deploy/
cp netlify.toml partsfinda-deploy/
cp -r public partsfinda-deploy/ 2>/dev/null || true
cp -r src partsfinda-deploy/
```

3. **Go to:** [app.netlify.com/drop](https://app.netlify.com/drop)
4. **Drag & drop** the `partsfinda-deploy` folder
5. **Done!** Your site will be live in 30 seconds

---

## Option 2: GitHub Deploy (Recommended for Updates)

1. **Create GitHub repo:**
```bash
cd partsfinda
git init
git add .
git commit -m "PartsFinda ready"
```

2. **Push to GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Create repo named `partsfinda`
   - Run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/partsfinda.git
git push -u origin main
```

3. **Connect to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select `partsfinda` repo
   - Click "Deploy site"

---

## Option 3: Netlify CLI (For Developers)

```bash
# Install CLI
npm install -g netlify-cli

# Deploy
cd partsfinda
netlify init
netlify deploy --prod
```

---

## ✅ Your Site is Ready!

All APIs are configured:
- ✅ Stripe Payments (Test mode)
- ✅ Cloudinary Images
- ✅ Resend Emails
- ✅ Supabase Database

Test accounts ready:
- Buyer: `buyer@demo.com` / `demo123`
- Seller: `seller@demo.com` / `demo123`

---

**Need help?** The site is fully configured and will work immediately once deployed!
