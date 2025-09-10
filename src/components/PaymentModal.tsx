'use client';

import { useState } from 'react';
import { formatJMD } from '@/lib/currency';
import { X, CreditCard, Loader } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'subscription' | 'urgent_request';
  plan?: string;
  priority?: string;
  amount: number;
  description: string;
  onSuccess: (paymentData: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  type,
  plan,
  priority,
  amount,
  description,
  onSuccess
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleStripePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          plan,
          priority,
          email: localStorage.getItem('userEmail') || 'user@example.com',
          amount
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.paymentIntent) {
          // Simulate successful payment
          setTimeout(() => {
            onSuccess({
              method: 'stripe',
              paymentIntentId: data.paymentIntent.id,
              amount: data.amount
            });
            onClose();
          }, 2000);
        } else {
          // No payment needed (free tier)
          onSuccess({ method: 'stripe', amount: 0 });
          onClose();
        }
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/payments/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          plan,
          priority,
          email: localStorage.getItem('userEmail') || 'user@example.com',
          amount,
          returnUrl: window.location.origin + '/payment/success',
          cancelUrl: window.location.origin + '/payment/cancel'
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.order) {
          // Simulate PayPal redirect
          setTimeout(() => {
            onSuccess({
              method: 'paypal',
              orderId: data.order.id,
              amount: data.amount
            });
            onClose();
          }, 2000);
        } else {
          // No payment needed (free tier)
          onSuccess({ method: 'paypal', amount: 0 });
          onClose();
        }
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'stripe') {
      handleStripePayment();
    } else {
      handlePayPalPayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={processing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">{description}</p>
            <p className="text-3xl font-bold text-blue-600">
              JMD ${amount.toLocaleString()}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="font-bold text-blue-800">Pay</span>
                <span className="font-bold text-blue-600">Pal</span>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            {paymentMethod === 'stripe' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay JMD $${amount.toLocaleString()}`
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>🔒 Secure Payment</span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
