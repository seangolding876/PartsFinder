import { NextRequest, NextResponse } from 'next/server';
import { formatJMD } from '@/lib/currency';

// PayPal payment integration
// This simulates PayPal order creation and processing

interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'COMPLETED';
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    description: string;
  }>;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// Subscription pricing in JMD
const SUBSCRIPTION_PRICES = {
  basic: 0,
  professional: 2500,
  enterprise: 5000
};

// Urgent request pricing in JMD
const URGENT_REQUEST_PRICES = {
  standard: 0,
  urgent: 500,
  premium: 1500
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, plan, priority, email, returnUrl, cancelUrl, metadata } = body;

    // Validate input
    if (!type || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let amount = 0;
    let description = '';

    // Calculate amount based on payment type
    if (type === 'subscription') {
      if (!plan || !SUBSCRIPTION_PRICES.hasOwnProperty(plan)) {
        return NextResponse.json(
          { error: 'Invalid subscription plan' },
          { status: 400 }
        );
      }
      amount = SUBSCRIPTION_PRICES[plan as keyof typeof SUBSCRIPTION_PRICES];
      description = `PartsFinda ${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`;
    } else if (type === 'urgent_request') {
      if (!priority || !URGENT_REQUEST_PRICES.hasOwnProperty(priority)) {
        return NextResponse.json(
          { error: 'Invalid priority level' },
          { status: 400 }
        );
      }
      amount = URGENT_REQUEST_PRICES[priority as keyof typeof URGENT_REQUEST_PRICES];
      description = `PartsFinda ${priority.charAt(0).toUpperCase() + priority.slice(1)} Part Request`;
    } else {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // Skip payment for free items
    if (amount === 0) {
      return NextResponse.json({
        success: true,
        order: null,
        message: 'No payment required for this selection'
      });
    }

    // Simulate creating a PayPal order
    // In production, this would use PayPal SDK
    const orderId = `PAYPAL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order: PayPalOrder = {
      id: orderId,
      status: 'CREATED',
      purchase_units: [{
        amount: {
          currency_code: 'JMD',
          value: amount.toFixed(2)
        },
        description
      }],
      links: [
        {
          href: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
          rel: 'approve',
          method: 'GET'
        },
        {
          href: `/api/payments/paypal/${orderId}`,
          rel: 'self',
          method: 'GET'
        },
        {
          href: `/api/payments/paypal/${orderId}/capture`,
          rel: 'capture',
          method: 'POST'
        }
      ]
    };

    // Log the payment attempt (in production, save to database)
    console.log('PayPal order created:', {
      id: order.id,
      amount,
      description,
      email
    });

    return NextResponse.json({
      success: true,
      order,
      amount,
      description,
      approvalUrl: order.links.find(link => link.rel === 'approve')?.href
    });

  } catch (error) {
    console.error('PayPal error:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}

// Capture PayPal payment after approval
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, payerId } = body;

    if (!orderId || !payerId) {
      return NextResponse.json(
        { error: 'Missing order ID or payer ID' },
        { status: 400 }
      );
    }

    // Simulate capturing the PayPal payment
    // In production, this would use PayPal SDK to capture the order
    const captureResult = {
      id: orderId,
      status: 'COMPLETED',
      payer: {
        payer_id: payerId,
        email_address: 'buyer@example.com'
      },
      purchase_units: [{
        payments: {
          captures: [{
            id: `CAPTURE_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            status: 'COMPLETED',
            amount: {
              currency_code: 'JMD',
              value: '2500.00'
            }
          }]
        }
      }]
    };

    console.log('PayPal payment captured:', captureResult);

    return NextResponse.json({
      success: true,
      capture: captureResult,
      message: 'Payment successfully captured'
    });

  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment' },
      { status: 500 }
    );
  }
}

// Get PayPal order details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }

    // Simulate fetching PayPal order details
    // In production, this would use PayPal SDK
    const order = {
      id: orderId,
      status: 'APPROVED',
      payer: {
        email_address: 'buyer@example.com',
        payer_id: `PAYER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      },
      purchase_units: [{
        amount: {
          currency_code: 'JMD',
          value: '2500.00'
        },
        description: 'PartsFinda Professional Subscription'
      }]
    };

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('PayPal order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PayPal order' },
      { status: 500 }
    );
  }
}
