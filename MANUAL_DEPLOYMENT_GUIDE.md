# 🚀 Manual Deployment Guide for PartsFinda

## ✅ Your API Keys Are Configured!

All your API keys have been successfully added to the project:
- **Stripe**: Test mode configured ✅
- **Cloudinary**: Ready for image uploads ✅
- **Resend**: Email service configured ✅
- **Supabase**: Database configured ✅

---

## 📋 Option 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Push to GitHub
```bash
cd partsfinda
git init
git add .
git commit -m "PartsFinda marketplace ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/partsfinda.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your `partsfinda` repository
5. **Build settings will be auto-detected** from `netlify.toml`

### Step 3: Deploy
- Click "Deploy site"
- Wait 3-5 minutes for build to complete
- Your site will be live at a Netlify URL

### Step 4: Add Custom Domain
1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter `partsfinda.com`
4. Follow DNS configuration instructions

---

## 📋 Option 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login and Link
```bash
cd partsfinda
netlify login
netlify init
```

### Step 3: Deploy
```bash
# Test deployment
netlify deploy

# Production deployment
netlify deploy --prod
```

---

## 📋 Option 3: Drag & Drop Deploy

### Step 1: Build Locally
```bash
cd partsfinda
bun install
bun run build
```

### Step 2: Create Deploy Package
```bash
# Create a folder with all necessary files
mkdir deploy-package
cp -r .next deploy-package/
cp -r public deploy-package/
cp -r src deploy-package/
cp package.json deploy-package/
cp netlify.toml deploy-package/
cp next.config.js deploy-package/
cp tsconfig.json deploy-package/
```

### Step 3: Deploy
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the `deploy-package` folder to the deployment area
3. Wait for deployment to complete

---

## 🔧 Environment Variables (Already Configured)

Your `netlify.toml` already contains all necessary environment variables:

```toml
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_51S4pGYPP..."
STRIPE_SECRET_KEY = "sk_test_51S4pGYPP..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "deuim58dp"
CLOUDINARY_API_KEY = "582245338175986"
CLOUDINARY_API_SECRET = "rGVrzJb0pwigSMDAMLRDqLbRUVE"
RESEND_API_KEY = "re_22SZjK9K_9UVTtzugSLg27mG24adGZwXT"
```

---

## 🧪 Test Your Deployment

### 1. Test Homepage
- Visit your deployed URL
- Check VIN decoder works
- Verify car selection dropdowns

### 2. Test Authentication
- Register a new account
- Login with demo accounts:
  - Buyer: `buyer@demo.com` / `demo123`
  - Seller: `seller@demo.com` / `demo123`

### 3. Test Payments (Test Mode)
- Add items to cart
- Go to checkout
- Use test card: `4242 4242 4242 4242`

### 4. Test Email
- Submit a part request
- Check if notification emails are sent

### 5. Test Admin Panel
- Visit `/admin/api-status`
- Password: `admin2024`
- Verify all services show as configured

---

## 🔍 Troubleshooting

### If Build Fails on Netlify

1. **Check Build Logs**
   - Go to Netlify dashboard → Deploys → Click on failed deploy
   - Review build logs for specific errors

2. **Common Fixes**:
   ```bash
   # Clear cache and rebuild
   netlify build --clear-cache

   # Update dependencies
   bun install

   # Verify build locally
   bun run build
   ```

3. **Environment Variables**
   - Ensure all variables in netlify.toml are correct
   - No spaces before or after `=` sign
   - Quotes around string values

### If Site Shows 404

1. Check publish directory is `.next`
2. Ensure Next.js plugin is installed: `@netlify/plugin-nextjs`
3. Verify build command: `bun install && bun run build`

---

## 📞 Support Contacts

- **Netlify Support**: [answers.netlify.com](https://answers.netlify.com)
- **PartsFinda Admin**: admin@partsfinda.com
- **Developer Support**: Check GitHub Issues

---

## ✅ Deployment Checklist

- [ ] All API keys configured in netlify.toml
- [ ] Project builds successfully locally
- [ ] GitHub repository created
- [ ] Connected to Netlify
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Test all features working
- [ ] Monitor first 24 hours

---

## 🎉 Success Indicators

When deployment is successful, you should see:
- ✅ Green "Published" status in Netlify
- ✅ Site accessible at your URL
- ✅ All pages loading correctly
- ✅ API endpoints responding
- ✅ Images loading from Cloudinary
- ✅ Payments processing (test mode)
- ✅ Emails sending via Resend

---

**Your PartsFinda marketplace is ready for deployment!**

Build time: ~3-5 minutes
Deploy time: ~1 minute
Time to live: ~5 minutes total

---

*Last updated: January 2025*
*PartsFinda v1.0 - Production Ready*
