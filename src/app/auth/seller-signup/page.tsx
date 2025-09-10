'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    ownerName: '',
    phone: '',
    location: '',
    businessType: '',
    subscriptionTier: 'basic'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Call the new seller registration API endpoint
      const response = await fetch('/api/auth/seller-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          location: formData.location,
          businessType: formData.businessType,
          subscriptionTier: formData.subscriptionTier
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store auth token and seller data
        localStorage.setItem('auth_token', result.authToken);
        localStorage.setItem('seller_data', JSON.stringify(result.seller));
        localStorage.setItem('user_role', 'seller');
        localStorage.setItem('seller_tier', formData.subscriptionTier);

        // Show success message
        alert('Seller account created successfully! Welcome to PartsFinda.');

        // Redirect to seller dashboard
        router.push('/seller/dashboard');
      } else {
        setError(result.error || 'Unable to create seller account. Please try again.');
      }

    } catch (err) {
      console.error('Seller signup error:', err);
      setError('Unable to create seller account. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
    'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
    'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Become a Seller</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Owner Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="business@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="876-XXX-XXXX"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Location (Parish) *</label>
                <select
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select parish</option>
                  {jamaicaParishes.map(parish => (
                    <option key={parish} value={parish}>{parish}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Type *</label>
                <select
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="auto-parts-store">Auto Parts Store</option>
                  <option value="mechanic-shop">Mechanic Shop</option>
                  <option value="dealership">Dealership</option>
                  <option value="individual">Individual Seller</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Subscription Tier Selection */}
            <div>
              <label className="block text-sm font-medium mb-4">Choose Your Plan</label>
              <div className="grid md:grid-cols-3 gap-4">
                <label className={`border-2 rounded-lg p-4 cursor-pointer ${formData.subscriptionTier === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="subscriptionTier"
                    value="basic"
                    checked={formData.subscriptionTier === 'basic'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h3 className="font-bold">Basic</h3>
                    <p className="text-2xl font-bold text-green-600">FREE</p>
                    <p className="text-sm text-gray-600 mt-2">Up to 10 listings</p>
                  </div>
                </label>

                <label className={`border-2 rounded-lg p-4 cursor-pointer ${formData.subscriptionTier === 'professional' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="subscriptionTier"
                    value="professional"
                    checked={formData.subscriptionTier === 'professional'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h3 className="font-bold">Professional</h3>
                    <p className="text-2xl font-bold">$2,500/mo</p>
                    <p className="text-sm text-gray-600 mt-2">Unlimited listings</p>
                  </div>
                </label>

                <label className={`border-2 rounded-lg p-4 cursor-pointer ${formData.subscriptionTier === 'enterprise' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="subscriptionTier"
                    value="enterprise"
                    checked={formData.subscriptionTier === 'enterprise'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h3 className="font-bold">Enterprise</h3>
                    <p className="text-2xl font-bold">$5,000/mo</p>
                    <p className="text-sm text-gray-600 mt-2">Premium features</p>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Seller Account'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
