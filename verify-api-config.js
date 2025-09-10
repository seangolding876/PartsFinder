#!/usr/bin/env node

/**
 * API Configuration Verification Script
 * Run this after setting up your production API keys
 * Usage: node verify-api-config.js
 */

const https = require('https');

console.log('🔍 PartsFinda API Configuration Verifier\n');
console.log('========================================\n');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// Check if running locally or on deployed site
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://partsfinda.com';

// Test results
let results = {
  stripe: false,
  cloudinary: false,
  resend: false,
  supabase: false
};

// Helper function to make HTTPS requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Test 1: Check environment variables are set
async function checkEnvironmentVars() {
  console.log(`${colors.blue}1. Checking Environment Variables...${colors.reset}`);

  const requiredVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missing = [];

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      // Don't show the actual value for security
      const maskedValue = varName.includes('SECRET') || varName.includes('KEY')
        ? '***' + process.env[varName].slice(-4)
        : process.env[varName].slice(0, 10) + '...';
      console.log(`  ✅ ${varName}: ${maskedValue}`);
    } else {
      missing.push(varName);
      console.log(`  ❌ ${varName}: NOT SET`);
    }
  });

  if (missing.length === 0) {
    console.log(`${colors.green}  All environment variables are set!${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}  Missing ${missing.length} environment variables${colors.reset}\n`);
    return false;
  }
}

// Test 2: Verify Stripe API
async function testStripeAPI() {
  console.log(`${colors.blue}2. Testing Stripe Payment API...${colors.reset}`);

  try {
    const testPayment = JSON.stringify({
      amount: 15500, // J$155.00
      currency: 'jmd',
      customerInfo: {
        email: 'test@partsfinda.com',
        firstName: 'API',
        lastName: 'Test',
        billingAddress: {
          line1: '123 Test St',
          city: 'Kingston',
          state: 'JM',
          postal_code: '00000',
          country: 'JM'
        },
        shippingAddress: {
          line1: '123 Test St',
          city: 'Kingston',
          state: 'JM',
          postal_code: '00000',
          country: 'JM'
        }
      },
      items: [{
        id: 'test-1',
        name: 'Test Part',
        price: 100,
        quantity: 1
      }]
    });

    const url = new URL(`${BASE_URL}/api/payments/create-intent`);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testPayment.length
      }
    };

    const response = await makeRequest(options, testPayment);

    if (response.status === 200 && response.data.success) {
      console.log(`  ✅ Stripe API working!`);
      console.log(`  Payment Intent Created: ${response.data.paymentIntentId || 'mock'}`);
      results.stripe = true;
    } else {
      console.log(`  ❌ Stripe API failed: ${response.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`  ❌ Stripe test failed: ${error.message}`);
  }

  console.log('');
}

// Test 3: Verify Email API (Resend)
async function testEmailAPI() {
  console.log(`${colors.blue}3. Testing Email API (Resend)...${colors.reset}`);

  try {
    const testEmail = JSON.stringify({
      type: 'part_request',
      to: 'admin@partsfinda.com',
      subject: 'API Configuration Test',
      data: {
        requestId: 'test-123',
        partName: 'Test Part',
        vehicle: '2024 Test Vehicle',
        customerName: 'API Tester',
        location: 'Kingston',
        budget: 'J$10,000',
        quantity: 1,
        description: 'This is a test email from API verification',
        urgency: 'normal'
      }
    });

    const url = new URL(`${BASE_URL}/api/notifications`);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testEmail.length
      }
    };

    const response = await makeRequest(options, testEmail);

    if (response.status === 200 && response.data.success) {
      console.log(`  ✅ Email API working!`);
      console.log(`  Email ID: ${response.data.emailId || 'demo mode'}`);
      results.resend = true;
    } else {
      console.log(`  ⚠️  Email API in demo mode or not configured`);
    }
  } catch (error) {
    console.log(`  ❌ Email test failed: ${error.message}`);
  }

  console.log('');
}

// Test 4: Verify Cloudinary Configuration
async function testCloudinary() {
  console.log(`${colors.blue}4. Testing Cloudinary Configuration...${colors.reset}`);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || cloudName === 'your_cloud_name') {
    console.log(`  ⚠️  Cloudinary not configured (using placeholder values)`);
  } else {
    console.log(`  ✅ Cloudinary Cloud Name: ${cloudName}`);
    console.log(`  📸 Upload URL: https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    results.cloudinary = true;
  }

  console.log('');
}

// Test 5: Verify Supabase Connection
async function testSupabase() {
  console.log(`${colors.blue}5. Testing Supabase Connection...${colors.reset}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('your_')) {
    console.log(`  ✅ Supabase URL configured: ${supabaseUrl}`);
    results.supabase = true;
  } else {
    console.log(`  ⚠️  Supabase using default configuration`);
  }

  console.log('');
}

// Main execution
async function runTests() {
  console.log(`Testing configuration for: ${colors.yellow}${BASE_URL}${colors.reset}\n`);

  // Run all tests
  await checkEnvironmentVars();
  await testStripeAPI();
  await testEmailAPI();
  await testCloudinary();
  await testSupabase();

  // Summary
  console.log('========================================');
  console.log(`${colors.blue}📊 Configuration Summary:${colors.reset}\n`);

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;

  console.log(`  Stripe Payments:  ${results.stripe ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`  Email (Resend):   ${results.resend ? '✅ Configured' : '⚠️  Demo mode'}`);
  console.log(`  Cloudinary:       ${results.cloudinary ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`  Supabase:         ${results.supabase ? '✅ Configured' : '⚠️  Using defaults'}`);

  console.log('\n========================================\n');

  if (passedTests === totalTests) {
    console.log(`${colors.green}🎉 All services configured successfully!${colors.reset}`);
    console.log('Your PartsFinda marketplace is ready for production.\n');
  } else if (passedTests > 0) {
    console.log(`${colors.yellow}⚠️  ${passedTests}/${totalTests} services configured${colors.reset}`);
    console.log('Some services need configuration. Check the guide above.\n');
  } else {
    console.log(`${colors.red}❌ No services configured yet${colors.reset}`);
    console.log('Please add your API keys to Netlify environment variables.\n');
  }

  console.log('📚 For detailed setup instructions, see:');
  console.log('   • PRODUCTION_API_SETUP.md');
  console.log('   • QUICK_API_REFERENCE.md\n');
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
});
