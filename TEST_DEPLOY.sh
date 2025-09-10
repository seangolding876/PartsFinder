#!/bin/bash
echo "Testing PartsFinda deployment..."
echo ""
echo "1. Build test..."
npm run build 2>&1 | tail -3
echo ""
echo "2. Checking files..."
ls -la netlify.toml package.json next.config.js 2>/dev/null | wc -l
echo ""
echo "3. API routes:"
find src/app/api -name "*.ts" | wc -l
echo ""
echo "4. Auth pages:"
ls -la src/app/auth/*/page.tsx 2>/dev/null | wc -l
echo ""
echo "5. Contact info:"
grep -q "partsfinda@gmail.com" src/app/layout.tsx && echo "Email OK" || echo "Email missing"
grep -q "1-876-219-3329" src/app/page.tsx && echo "Phone OK" || echo "Phone missing"
echo ""
echo "Ready to deploy? Run: ./DEPLOY_TO_NETLIFY.sh"

