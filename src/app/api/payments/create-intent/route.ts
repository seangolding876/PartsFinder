import { NextRequest, NextResponse } from 'next/server';
import { formatJMD } from '@/lib/currency';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY ?? '', { apiVersion: '2024-06-20' });

type Item = { priceJmd?: number; price?: number; qty?: number; quantity?: number };

function calcTotalJmd(items: Item[]): number {
  return items.reduce((sum, it) => {
    const unit = (typeof it.priceJmd === 'number' ? it.priceJmd : (typeof it.price === 'number' ? it.price : 0));
    const q = (typeof it.qty === 'number' ? it.qty : (typeof it.quantity === 'number' ? it.quantity : 1));
    return sum + unit * q;
  }, 0);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: Item[] = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return NextResponse.json({ error: 'No items' }, { status: 400 });

    const totalJmd = calcTotalJmd(items);
    const amount = Math.round(totalJmd * 100); // JMD cents

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ clientSecret: 'mock_client_secret', amount, currency: 'jmd', mock: true });
    }

    const pi = await stripe.paymentIntents.create({
      amount,
      currency: 'jmd',
      automatic_payment_methods: { enabled: true },
      metadata: { currency: 'JMD' }
    });

    return NextResponse.json({ clientSecret: pi.client_secret, amount, currency: 'jmd' });
  } catch (err: any) {
    console.error('create-intent error:', err);
    return NextResponse.json({ error: err?.message ?? 'Payment error' }, { status: 400 });
  }
}
