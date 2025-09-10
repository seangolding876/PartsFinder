# 🚗 PartsFinda - Jamaica's Auto Parts Marketplace

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/partsfinda/deploys)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-green)](https://stripe.com/)

## 🌟 Overview

PartsFinda is a comprehensive auto parts marketplace connecting buyers with verified sellers across Jamaica. Built with Next.js 14, TypeScript, and integrated with Stripe, Cloudinary, and Resend APIs.

## 🚀 Quick Deploy

### Deploy to Netlify
1. Fork this repository
2. Connect to Netlify
3. Deploy automatically

### Manual Deploy
```bash
git clone https://github.com/YOUR_USERNAME/partsfinda.git
cd partsfinda
bun install
bun run build
netlify deploy --prod
```

## 🔑 Features

- ✅ **VIN Decoder** - Instant vehicle identification
- ✅ **Part Request System** - Connect buyers with sellers
- ✅ **Seller Dashboard** - Manage inventory and orders
- ✅ **Secure Payments** - Stripe integration (Test mode)
- ✅ **Email Notifications** - Automated via Resend
- ✅ **Image Management** - Cloudinary integration
- ✅ **Real-time Cart** - Persistent shopping experience
- ✅ **Admin Panel** - Monitor API status

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Buyer | buyer@demo.com | demo123 |
| Seller | seller@demo.com | demo123 |
| Admin Panel | - | admin2024 |

## 💳 Test Payment

Use Stripe test card:
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## 📊 API Services

| Service | Status | Purpose |
|---------|--------|---------|
| Stripe | ✅ Configured | Payment processing |
| Cloudinary | ✅ Configured | Image management |
| Resend | ✅ Configured | Email notifications |
| Supabase | ✅ Configured | Database |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Stripe API
- **Images**: Cloudinary
- **Email**: Resend
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify

## 📁 Project Structure

```
partsfinda/
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── api/       # API routes
│   │   ├── auth/      # Authentication pages
│   │   ├── seller/    # Seller dashboard
│   │   └── admin/     # Admin panel
│   ├── components/    # React components
│   └── lib/          # Utilities and contexts
├── public/           # Static assets
├── netlify.toml      # Netlify configuration
└── package.json      # Dependencies
```

## 🚀 Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## 🧪 Testing

```bash
# Test deployment
node test-deployment.js https://your-site.netlify.app

# Check API status
curl https://your-site.netlify.app/api/vin?vin=WBAFH62010L870435
```

## 📈 Environment Variables

All environment variables are configured in `netlify.toml`:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/seller-register` | POST | Seller registration |
| `/api/payments/create-intent` | POST | Create payment intent |
| `/api/vin` | GET | Decode VIN number |
| `/api/part-requests` | POST | Submit part request |
| `/api/notifications` | POST | Send email notification |

## 🔒 Security

- Environment variables secured in Netlify
- Stripe webhook signature verification
- Input validation on all forms
- SQL injection prevention via Supabase
- XSS protection headers

## 📞 Support

- **Email**: admin@partsfinda.com
- **Phone**: 1-876-219-3329
- **Admin Panel**: `/admin/api-status`

## 📄 License

© 2025 PartsFinda Inc. All rights reserved.

---

**Live Site**: [https://partsfinda.com](https://partsfinda.com)
**Status Page**: [Netlify Dashboard](https://app.netlify.com/sites/partsfinda/deploys)
