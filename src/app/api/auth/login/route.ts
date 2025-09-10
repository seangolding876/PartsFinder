import { NextRequest, NextResponse } from 'next/server';

// Demo accounts for testing
const demoAccounts = [
  {
    email: 'buyer@demo.com',
    password: 'demo123',
    id: 'demo_buyer_1',
    name: 'Demo Buyer',
    role: 'buyer',
    phone: '+1-876-555-0100'
  },
  {
    email: 'seller@demo.com',
    password: 'demo123',
    id: 'demo_seller_1',
    name: 'Demo Seller',
    role: 'seller',
    businessName: 'Demo Auto Parts',
    phone: '+1-876-555-0200'
  },
  {
    email: 'john.doe@email.com',
    password: 'password123',
    id: 'user_john',
    name: 'John Doe',
    role: 'buyer'
  },
  {
    email: 'auto.parts@business.com',
    password: 'seller123',
    id: 'seller_auto',
    name: 'Auto Parts Pro',
    role: 'seller',
    businessName: 'Auto Parts Pro Ltd'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in demo accounts
    const user = demoAccounts.find(
      account => account.email === email && account.password === password
    );

    if (!user) {
      // In production, check against Supabase
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate auth token (mock)
    const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Return user data based on role
    if (user.role === 'seller') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        authToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          businessName: (user as any).businessName,
          phone: user.phone
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      authToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
