#!/bin/bash

echo "================================================"
echo "  🧪 PARTSFINDA DEPLOYMENT TEST"
echo "================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function for warnings
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

echo "🔍 Running deployment tests..."
echo ""

# 1. Check Node version
echo "1. Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    check_status 0 "Node.js version is 18 or higher"
else
    check_status 1 "Node.js version is too low (need 18+)"
fi

# 2. Check npm packages
echo ""
echo "2. Checking npm packages..."
npm list next react react-dom @supabase/supabase-js stripe 2>/dev/null | grep -E "(next|react|stripe|supabase)" > /dev/null
check_status $? "Required packages installed"

# 3. Check build
echo ""
echo "3. Testing build..."
npm run build > /tmp/build.log 2>&1
BUILD_STATUS=$?
if [ $BUILD_STATUS -eq 0 ]; then
    check_status 0 "Build successful"
    PAGES=$(grep -o "Generating static pages ([0-9]*/" /tmp/build.log | tail -1 | grep -o "[0-9]*")
    echo "   📄 Generated $PAGES pages"
else
    check_status 1 "Build failed"
    echo "   Error: $(tail -3 /tmp/build.log)"
fi

# 4. Check environment files
echo ""
echo "4. Checking configuration files..."
[ -f "netlify.toml" ] && check_status 0 "netlify.toml exists" || check_status 1 "netlify.toml missing"
[ -f "next.config.js" ] && check_status 0 "next.config.js exists" || check_status 1 "next.config.js missing"
[ -f "package.json" ] && check_status 0 "package.json exists" || check_status 1 "package.json missing"

# 5. Check Netlify plugin
echo ""
echo "5. Checking Netlify plugin..."
grep -q "@netlify/plugin-nextjs" package.json
if [ $? -eq 0 ]; then
    check_status 0 "Netlify Next.js plugin installed"
else
    warning "Netlify Next.js plugin not in package.json"
    echo "   Installing plugin..."
    npm install --save-dev @netlify/plugin-nextjs
fi

# 6. Check API routes
echo ""
echo "6. Checking API routes..."
API_ROUTES=$(find src/app/api -name "route.ts" 2>/dev/null | wc -l)
if [ $API_ROUTES -gt 0 ]; then
    check_status 0 "Found $API_ROUTES API routes"
else
    warning "No API routes found"
fi

# 7. Check for common issues
echo ""
echo "7. Checking for common issues..."

# Check for hardcoded localhost
grep -r "localhost:3000" src/ 2>/dev/null | grep -v "NEXT_PUBLIC_SITE_URL" > /dev/null
if [ $? -eq 0 ]; then
    warning "Found hardcoded localhost references"
else
    check_status 0 "No hardcoded localhost found"
fi

# Check for console.log statements
CONSOLE_LOGS=$(grep -r "console.log" src/ 2>/dev/null | wc -l)
if [ $CONSOLE_LOGS -gt 10 ]; then
    warning "Found $CONSOLE_LOGS console.log statements"
else
    check_status 0 "Minimal console.log usage"
fi

# 8. Check contact information
echo ""
echo "8. Verifying contact information..."
grep -q "partsfinda@gmail.com" src/app/layout.tsx
check_status $? "Email (partsfinda@gmail.com) is set"
grep -q "1-876-219-3329" src/app/page.tsx
check_status $? "Phone (1-876-219-3329) is set"

# 9. Check authentication pages
echo ""
echo "9. Checking authentication pages..."
[ -f "src/app/auth/login/page.tsx" ] && check_status 0 "Login page exists" || check_status 1 "Login page missing"
[ -f "src/app/auth/register/page.tsx" ] && check_status 0 "Register page exists" || check_status 1 "Register page missing"
[ -f "src/app/auth/seller-signup/page.tsx" ] && check_status 0 "Seller signup exists" || check_status 1 "Seller signup missing"

# 10. Check cart functionality
echo ""
echo "10. Checking cart system..."
[ -f "src/lib/CartContext.tsx" ] && check_status 0 "Cart context exists" || check_status 1 "Cart context missing"
[ -f "src/components/Navigation.tsx" ] && check_status 0 "Navigation component exists" || check_status 1 "Navigation missing"

# Summary
echo ""
echo "================================================"
echo "  📊 TEST SUMMARY"
echo "================================================"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "Your deployment is ready. Run:"
    echo "  ./DEPLOY_TO_NETLIFY.sh"
else
    echo -e "${RED}❌ FOUND $ERRORS ERRORS${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warnings found (non-critical)${NC}"
fi

echo ""
echo "================================================"

exit $ERRORS
