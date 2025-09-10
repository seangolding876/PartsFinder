'use client';

import { useState, useEffect } from 'react';
import { formatJMD } from '@/lib/currency';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalSales: number;
  revenue: number;
  rating: number;
  reviews: number;
}

interface Order {
  id: string;
  customer: string;
  part: string;
  amount: number;
  status: string;
}

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  price: number;
  status: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionTier, setSubscriptionTier] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    totalSales: 0,
    revenue: 0,
    rating: 0,
    reviews: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check authentication and fetch dashboard data
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check if user is authenticated and is a seller
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const userRole = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-role='))
        ?.split('=')[1];

      if (!authToken || userRole !== 'seller') {
        router.push('/auth/login?redirectTo=/seller/dashboard');
        return;
      }

      // Get user email from localStorage or cookie
      const email = localStorage.getItem('userEmail') ||
        document.cookie
          .split('; ')
          .find(row => row.startsWith('user-email='))
          ?.split('=')[1] || '';

      setUserEmail(email);

      // Fetch seller's subscription tier
      const subTier = localStorage.getItem('subscriptionTier') || 'basic';
      setSubscriptionTier(subTier);

      // Fetch dashboard stats
      await fetchDashboardData();

    } catch (error) {
      console.error('Error checking authentication:', error);
      router.push('/auth/login?redirectTo=/seller/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch parts/listings for this seller
      const partsResponse = await fetch('/api/parts');
      if (partsResponse.ok) {
        const partsData = await partsResponse.json();
        const sellerParts = partsData.filter((part: any) =>
          part.seller_email === userEmail || part.seller === userEmail
        );

        setStats(prev => ({
          ...prev,
          totalListings: sellerParts.length,
          activeListings: sellerParts.filter((p: any) => p.stock > 0).length
        }));

        // Convert parts to inventory items
        const inventoryItems = sellerParts.slice(0, 5).map((part: any, index: number) => ({
          id: part.id || index + 1,
          name: part.name,
          stock: part.stock || 0,
          price: part.price,
          status: part.stock > 10 ? 'In Stock' : part.stock > 0 ? 'Low Stock' : 'Out of Stock'
        }));
        setInventory(inventoryItems);
      }

      // Fetch orders for this seller
      const ordersResponse = await fetch('/api/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const sellerOrders = ordersData.filter((order: any) =>
          order.seller_email === userEmail || order.seller === userEmail
        );

        setStats(prev => ({
          ...prev,
          totalSales: sellerOrders.length,
          revenue: sellerOrders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)
        }));

        // Set recent orders
        const recent = sellerOrders.slice(0, 3).map((order: any) => ({
          id: order.id || `ORD-${Math.random().toString(36).substr(2, 9)}`,
          customer: order.customer_name || 'Customer',
          part: order.part_name || 'Part',
          amount: order.amount || 0,
          status: order.status || 'Processing'
        }));
        setRecentOrders(recent);
      }

      // Set some default rating data
      setStats(prev => ({
        ...prev,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 10
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          {userEmail && (
            <p className="text-gray-600">Logged in as: {userEmail}</p>
          )}
        </div>

        {/* Upgrade Banner for Basic Sellers */}
        {subscriptionTier === 'basic' && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Upgrade Your Account!</h2>
                <p className="text-white/90">
                  You're on the Basic plan. Upgrade to Professional or Enterprise for:
                </p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>✓ Unlimited part listings</li>
                  <li>✓ Priority in search results</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Instant email notifications for part requests</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">From JMD $2,500/mo</p>
                <a
                  href="/seller/subscription"
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 inline-block"
                >
                  Upgrade Now
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Active Listings</div>
            <div className="text-3xl font-bold">{stats.activeListings}</div>
            <div className="text-sm text-gray-500">of {stats.totalListings} total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Total Sales</div>
            <div className="text-3xl font-bold">{stats.totalSales}</div>
            <div className="text-sm text-green-600">This month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Revenue</div>
            <div className="text-3xl font-bold">JMD ${stats.revenue.toFixed(2)}</div>
            <div className="text-sm text-green-600">Total earnings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Rating</div>
            <div className="text-3xl font-bold">⭐ {stats.rating}</div>
            <div className="text-sm text-gray-500">{stats.reviews} reviews</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'inventory'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                {recentOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Order ID</th>
                          <th className="text-left py-2">Customer</th>
                          <th className="text-left py-2">Part</th>
                          <th className="text-left py-2">Amount</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3">{order.id}</td>
                            <td className="py-3">{order.customer}</td>
                            <td className="py-3">{order.part}</td>
                            <td className="py-3">JMD ${order.amount}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-sm ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No orders yet. Start by adding parts to the marketplace!</p>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Inventory Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    + Add New Part
                  </button>
                </div>
                {inventory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Part Name</th>
                          <th className="text-left py-2">Stock</th>
                          <th className="text-left py-2">Price</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map(item => (
                          <tr key={item.id} className="border-b">
                            <td className="py-3">{item.name}</td>
                            <td className="py-3">{item.stock}</td>
                            <td className="py-3">JMD ${formatJMD(item.price)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-sm ${
                                item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                              <button className="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No inventory items yet. Add your first part to get started!</p>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Management</h2>
                <p className="text-gray-600">Manage and track all your orders in one place.</p>
                {recentOrders.length === 0 && (
                  <p className="text-gray-500 mt-4">No orders to display yet.</p>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium mb-3">Performance Summary</h3>
                    <ul className="space-y-2">
                      <li>Total Listings: {stats.totalListings}</li>
                      <li>Active Listings: {stats.activeListings}</li>
                      <li>Total Revenue: JMD ${stats.revenue.toFixed(2)}</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium mb-3">Customer Feedback</h3>
                    <ul className="space-y-2">
                      <li>Average Rating: {stats.rating} ⭐</li>
                      <li>Total Reviews: {stats.reviews}</li>
                      <li>Response Rate: 95%</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
