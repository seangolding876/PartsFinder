#!/usr/bin/env node

/**
 * PartsFinda Deployment Test Script
 * Run this after deployment to verify all features are working
 * Usage: node test-deployment.js https://your-site.netlify.app
 */

const https = require('https');
const url = require('url');

// Get site URL from command line or use localhost
const SITE_URL = process.argv[2] || 'http://localhost:3000';
const parsedUrl = url.parse(SITE_URL);
const isHttps = parsedUrl.protocol === 'https:';
const http = isHttps ? https : require('http');

console.log('🧪 Testing PartsFinda Deployment\n');
console.log(`Site URL: ${SITE_URL}\n`);
console.log('========================================\n');

// Test results tracking
let passedTests = 0;
let failedTests = 0;

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// Helper function to make HTTP requests
function testEndpoint(path, method = 'GET', postData = null) {
  return new Promise((resolve) => {
    const fullUrl = `${SITE_URL}${path}`;
    const urlParts = url.parse(fullUrl);

    const options = {
      hostname: urlParts.hostname,
      port: urlParts.port,
      path: urlParts.pathname + (urlParts.search || ''),
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PartsFinda-Test/1.0'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = (isHttps ? https : require('http')).request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message
      });
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Test function wrapper
async function runTest(testName, testFunc) {
  process.stdout.write(`Testing ${testName}... `);
  try {
    const result = await testFunc();
    if (result) {
      console.log(`${colors.green}✓${colors.reset}`);
      passedTests++;
    } else {
      console.log(`${colors.red}✗${colors.reset}`);
      failedTests++;
    }
    return result;
  } catch (error) {
    console.log(`${colors.red}✗ (${error.message})${colors.reset}`);
    failedTests++;
    return false;
  }
}

// Main test suite
async function runTests() {
  console.log(`${colors.blue}1. Testing Page Routes${colors.reset}\n`);

  // Test homepage
  await runTest('Homepage', async () => {
    const res = await testEndpoint('/');
    return res.status === 200;
  });

  // Test marketplace
  await runTest('Marketplace', async () => {
    const res = await testEndpoint('/marketplace');
    return res.status === 200;
  });

  // Test auth pages
  await runTest('Login Page', async () => {
    const res = await testEndpoint('/auth/login');
    return res.status === 200;
  });

  await runTest('Register Page', async () => {
    const res = await testEndpoint('/auth/register');
    return res.status === 200;
  });

  // Test seller pages
  await runTest('Seller Signup', async () => {
    const res = await testEndpoint('/auth/seller-signup');
    return res.status === 200;
  });

  await runTest('Seller Dashboard', async () => {
    const res = await testEndpoint('/seller/dashboard');
    return res.status === 200;
  });

  console.log(`\n${colors.blue}2. Testing API Endpoints${colors.reset}\n`);

  // Test VIN decoder
  await runTest('VIN Decoder API', async () => {
    const res = await testEndpoint('/api/vin?vin=WBAFH62010L870435');
    if (res.status !== 200) return false;
    try {
      const data = JSON.parse(res.data);
      return data.success === true;
    } catch {
      return false;
    }
  });

  // Test auth API
  await runTest('Login API', async () => {
    const postData = JSON.stringify({
      email: 'buyer@demo.com',
      password: 'demo123'
    });
    const res = await testEndpoint('/api/auth/login', 'POST', postData);
    if (res.status !== 200) return false;
    try {
      const data = JSON.parse(res.data);
      return data.success === true;
    } catch {
      return false;
    }
  });

  // Test payment API
  await runTest('Payment API', async () => {
    const postData = JSON.stringify({
      amount: 15500,
      currency: 'jmd',
      customerInfo: {
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
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
      items: [{ id: '1', name: 'Test Part', price: 100, quantity: 1 }]
    });
    const res = await testEndpoint('/api/payments/create-intent', 'POST', postData);
    if (res.status !== 200) return false;
    try {
      const data = JSON.parse(res.data);
      return data.success === true || data.clientSecret !== undefined;
    } catch {
      return false;
    }
  });

  console.log(`\n${colors.blue}3. Testing Static Assets${colors.reset}\n`);

  // Test if static files are served
  await runTest('CSS Files', async () => {
    const res = await testEndpoint('/');
    return res.data.includes('/_next/static/css/');
  });

  await runTest('JavaScript Files', async () => {
    const res = await testEndpoint('/');
    return res.data.includes('/_next/static/chunks/');
  });

  console.log(`\n${colors.blue}4. Testing Features${colors.reset}\n`);

  // Test cart API
  await runTest('Cart API', async () => {
    const res = await testEndpoint('/api/cart', 'GET');
    // Cart API might return 405 for GET, which is expected
    return res.status === 200 || res.status === 405;
  });

  // Test part request API
  await runTest('Part Request API', async () => {
    const res = await testEndpoint('/api/part-requests', 'GET');
    // Might return 405 for GET, which is expected
    return res.status === 200 || res.status === 405;
  });

  // Test admin panel (should require auth)
  await runTest('Admin Panel', async () => {
    const res = await testEndpoint('/admin/api-status');
    return res.status === 200;
  });

  console.log('\n========================================\n');

  // Summary
  const total = passedTests + failedTests;
  const percentage = Math.round((passedTests / total) * 100);

  if (percentage === 100) {
    console.log(`${colors.green}🎉 ALL TESTS PASSED!${colors.reset}`);
  } else if (percentage >= 80) {
    console.log(`${colors.yellow}⚠️  Most tests passed, but some issues detected${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Multiple tests failed. Please check deployment${colors.reset}`);
  }

  console.log(`\nResults: ${passedTests}/${total} tests passed (${percentage}%)\n`);

  if (failedTests > 0) {
    console.log(`${colors.yellow}Troubleshooting Tips:${colors.reset}`);
    console.log('1. Check Netlify build logs for errors');
    console.log('2. Verify environment variables are set');
    console.log('3. Ensure all dependencies are installed');
    console.log('4. Check browser console for client-side errors\n');
  }

  // API Configuration Status
  console.log(`${colors.blue}API Configuration Status:${colors.reset}`);
  console.log(`Visit: ${SITE_URL}/admin/api-status`);
  console.log('Password: admin2024\n');

  return percentage === 100;
}

// Run the tests
console.log('Starting deployment tests...\n');
runTests().then((success) => {
  if (success) {
    console.log(`${colors.green}✅ Your PartsFinda deployment is working perfectly!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.yellow}⚠️  Some tests failed. Please review the results above.${colors.reset}\n`);
    process.exit(1);
  }
}).catch((error) => {
  console.error(`${colors.red}Test suite error: ${error.message}${colors.reset}`);
  process.exit(1);
});
