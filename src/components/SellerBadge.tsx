'use client';

import { Shield, Star, Award, CheckCircle, TrendingUp, Clock } from 'lucide-react';

interface SellerBadgeProps {
  verified: boolean;
  rating: number;
  reviewCount: number;
  tier?: 'basic' | 'silver' | 'gold' | 'platinum';
  salesCount?: number;
  responseTime?: string;
}

export default function SellerBadge({
  verified,
  rating,
  reviewCount,
  tier = 'basic',
  salesCount = 0,
  responseTime
}: SellerBadgeProps) {

  const getTierColor = () => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const getTierBadge = () => {
    switch (tier) {
      case 'platinum': return '💎 Platinum Seller';
      case 'gold': return '🏆 Gold Seller';
      case 'silver': return '🥈 Silver Seller';
      default: return '🔵 Basic Seller';
    }
  };

  const getPerformanceBadges = () => {
    const badges = [];

    if (salesCount > 100) {
      badges.push({ icon: <TrendingUp className="w-4 h-4" />, label: 'Top Seller', color: 'text-green-600' });
    }

    if (responseTime && parseInt(responseTime) < 2) {
      badges.push({ icon: <Clock className="w-4 h-4" />, label: 'Fast Response', color: 'text-blue-600' });
    }

    if (rating >= 4.5) {
      badges.push({ icon: <Award className="w-4 h-4" />, label: 'Top Rated', color: 'text-yellow-600' });
    }

    return badges;
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      {/* Seller Tier Badge */}
      <div className={`${getTierColor()} text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-3`}>
        {getTierBadge()}
      </div>

      {/* Verification Status */}
      {verified && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Verified Seller</span>
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
      </div>

      {/* Performance Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {getPerformanceBadges().map((badge, index) => (
          <div key={index} className={`flex items-center gap-1 ${badge.color} text-sm`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{salesCount}+</p>
          <p className="text-xs text-gray-500">Parts Sold</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{responseTime || '< 1hr'}</p>
          <p className="text-xs text-gray-500">Avg Response</p>
        </div>
      </div>

      {/* Trust Score */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Trust Score</span>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-lg text-blue-600">
              {Math.round((rating / 5) * 100)}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            style={{ width: `${(rating / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Additional component for inline seller badge (for listings)
export function SellerBadgeMini({ verified, rating, tier }: { verified: boolean; rating: number; tier?: string }) {
  return (
    <div className="flex items-center gap-2">
      {verified && (
        <div className="bg-green-100 text-green-700 p-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
        </div>
      )}
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
      {tier === 'gold' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Gold</span>}
      {tier === 'platinum' && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Platinum</span>}
    </div>
  );
}
