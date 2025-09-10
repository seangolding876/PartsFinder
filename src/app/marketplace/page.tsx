'use client';

import { useState, useEffect, Suspense } from 'react';
import { formatJMD } from '@/lib/currency';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { SellerBadgeMini } from '@/components/SellerBadge';
import { Shield, Star, CheckCircle, Package } from 'lucide-react';

interface Part {
  id: string;
  name: string;
  price: number;
  condition: 'new' | 'used' | 'refurbished';
  seller: string;
  sellerVerified?: boolean;
  sellerRating?: number;
  sellerTier?: 'basic' | 'silver' | 'gold' | 'platinum';
  image?: string;
  description?: string;
  stock: number;
  vehicle?: string;
  make?: string;
  model?: string;
  year?: string;
  partNumber?: string;
}

// Car makes and models data
const carData: { [key: string]: string[] } = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Prius', 'Sienna', '4Runner'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline', 'HR-V', 'Fit'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Maxima', 'Murano', 'Versa'],
  'Mazda': ['CX-5', 'Mazda3', 'CX-30', 'CX-9', 'MX-5 Miata', 'Mazda6', 'CX-50'],
  'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage', 'Outlander Sport', 'Pajero', 'L200'],
  'Subaru': ['Outback', 'Impreza', 'Crosstrek', 'Forester', 'Legacy', 'Ascent', 'WRX'],
  'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Baleno', 'S-Cross', 'Ignis', 'Alto'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Venue'],
  'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Seltos', 'Telluride', 'Soul'],
  'Ford': ['F-150', 'Explorer', 'Escape', 'Edge', 'Mustang', 'Ranger', 'Bronco'],
  'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Tahoe', 'Malibu', 'Colorado', 'Blazer'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series', 'X7', '4 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class', 'S-Class', 'GLA'],
  'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'Q8', 'A5'],
  'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'ID.4', 'Taos']
};

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    condition: '',
    minPrice: '',
    maxPrice: '',
    seller: '',
    verifiedOnly: false,
    make: '',
    model: '',
    year: ''
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Fetch parts from API
  useEffect(() => {
    fetchParts();
  }, []);

  // Update filters from search params
  useEffect(() => {
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    const year = searchParams.get('year') || '';

    setFilters(prev => ({
      ...prev,
      make,
      model,
      year
    }));

    if (make && carData[make]) {
      setAvailableModels(carData[make]);
    }
  }, [searchParams]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, parts]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/parts');

      if (!response.ok) {
        throw new Error('Failed to fetch parts');
      }

      const data = await response.json();

      // Transform the data to match our Part interface
      const transformedParts: Part[] = data.map((item: any, index: number) => ({
        id: item.id || `part-${index}`,
        name: item.name || 'Unknown Part',
        price: parseFloat(item.price) || 0,
        condition: item.condition || 'used',
        seller: item.seller || item.seller_name || 'Unknown Seller',
        sellerVerified: item.sellerVerified || Math.random() > 0.5,
        sellerRating: item.sellerRating || (3.5 + Math.random() * 1.5),
        sellerTier: item.sellerTier || 'basic',
        image: item.image || '🔧',
        description: item.description || 'Quality auto part',
        stock: parseInt(item.stock) || Math.floor(Math.random() * 20) + 1,
        vehicle: item.vehicle || 'Universal',
        make: item.make || '',
        model: item.model || '',
        year: item.year || '',
        partNumber: item.partNumber || `PN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }));

      setParts(transformedParts);

      // If no parts from API, use some sample data
      if (transformedParts.length === 0) {
        const sampleParts: Part[] = [
          {
            id: '1',
            name: 'Brake Pads - Ceramic Premium',
            price: 8999,
            condition: 'new',
            seller: 'AutoParts Pro',
            sellerVerified: true,
            sellerRating: 4.8,
            sellerTier: 'gold',
            image: '🔧',
            description: 'High-performance ceramic brake pads for superior stopping power',
            stock: 15,
            vehicle: 'Toyota Camry 2015-2020',
            make: 'Toyota',
            model: 'Camry',
            year: '2015-2020',
            partNumber: 'BP-12345'
          },
          {
            id: '2',
            name: 'Oil Filter - OEM Quality',
            price: 1299,
            condition: 'new',
            seller: 'Speed Shop Jamaica',
            sellerVerified: true,
            sellerRating: 4.6,
            sellerTier: 'silver',
            image: '🛢️',
            description: 'Original equipment manufacturer quality oil filter',
            stock: 50,
            vehicle: 'Honda Civic 2016-2021',
            make: 'Honda',
            model: 'Civic',
            year: '2016-2021',
            partNumber: 'OF-54321'
          },
          {
            id: '3',
            name: 'Alternator - Remanufactured',
            price: 18999,
            condition: 'refurbished',
            seller: 'Factory Direct Kingston',
            sellerVerified: true,
            sellerRating: 4.9,
            sellerTier: 'platinum',
            image: '⚡',
            description: 'Factory remanufactured alternator with 1-year warranty',
            stock: 8,
            vehicle: 'Nissan Altima 2013-2018',
            make: 'Nissan',
            model: 'Altima',
            year: '2013-2018',
            partNumber: 'ALT-98765'
          },
          {
            id: '4',
            name: 'Air Filter - Performance',
            price: 3499,
            condition: 'new',
            seller: 'Parts Warehouse JA',
            sellerVerified: false,
            sellerRating: 4.2,
            sellerTier: 'basic',
            image: '💨',
            description: 'High-flow performance air filter for improved engine efficiency',
            stock: 25,
            vehicle: 'Universal Fit',
            make: '',
            model: '',
            year: '',
            partNumber: 'AF-11111'
          },
          {
            id: '5',
            name: 'Spark Plugs - Iridium',
            price: 4599,
            condition: 'new',
            seller: 'Montego Bay Auto Parts',
            sellerVerified: true,
            sellerRating: 4.7,
            sellerTier: 'gold',
            image: '🔌',
            description: 'Premium iridium spark plugs for optimal performance',
            stock: 32,
            vehicle: 'Mazda CX-5 2017-2022',
            make: 'Mazda',
            model: 'CX-5',
            year: '2017-2022',
            partNumber: 'SP-77777'
          }
        ];
        setParts(sampleParts);
      }
    } catch (err) {
      console.error('Error fetching parts:', err);
      setError('Unable to load parts. Please try again later.');

      // Use fallback data on error
      const fallbackParts: Part[] = [
        {
          id: 'fb1',
          name: 'Brake Disc Rotor - Front',
          price: 12500,
          condition: 'new',
          seller: 'Kingston Auto Supply',
          sellerVerified: true,
          sellerRating: 4.5,
          sellerTier: 'silver',
          image: '🔧',
          description: 'Premium front brake disc rotor',
          stock: 10,
          vehicle: 'Honda CR-V 2017-2022',
          make: 'Honda',
          model: 'CR-V',
          year: '2017-2022',
          partNumber: 'BR-55555'
        }
      ];
      setParts(fallbackParts);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...parts];

    // Filter by make
    if (filters.make) {
      filtered = filtered.filter(part =>
        !part.make || part.make.toLowerCase().includes(filters.make.toLowerCase()) ||
        part.vehicle?.toLowerCase().includes(filters.make.toLowerCase())
      );
    }

    // Filter by model
    if (filters.model) {
      filtered = filtered.filter(part =>
        !part.model || part.model.toLowerCase().includes(filters.model.toLowerCase()) ||
        part.vehicle?.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(part =>
        !part.year || part.year.includes(filters.year) ||
        part.vehicle?.includes(filters.year)
      );
    }

    // Filter by condition
    if (filters.condition) {
      filtered = filtered.filter(part => part.condition === filters.condition);
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(part => part.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(part => part.price <= parseFloat(filters.maxPrice));
    }

    // Filter by seller
    if (filters.seller) {
      filtered = filtered.filter(part =>
        part.seller.toLowerCase().includes(filters.seller.toLowerCase())
      );
    }

    // Filter by verified sellers only
    if (filters.verifiedOnly) {
      filtered = filtered.filter(part => part.sellerVerified);
    }

    setFilteredParts(filtered);
  };

  const handleMakeChange = (make: string) => {
    setFilters({ ...filters, make, model: '' });
    if (make && carData[make]) {
      setAvailableModels(carData[make]);
    } else {
      setAvailableModels([]);
    }
  };

  const handleAddToCart = (part: Part) => {
    addItem({
      id: part.id,
      name: part.name,
      price: part.price,
      quantity: 1,
      seller: part.seller,
      image: part.image,
      vehicle: part.vehicle,
      partNumber: part.partNumber
    });

    // Show success message (replace with toast in production)
    alert(`${part.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Parts Marketplace</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Parts</h2>

          {/* Vehicle Filters Row */}
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Make</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.make}
                onChange={(e) => handleMakeChange(e.target.value)}
              >
                <option value="">All Makes</option>
                {Object.keys(carData).map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.model}
                onChange={(e) => setFilters({...filters, model: e.target.value})}
                disabled={!filters.make}
              >
                <option value="">
                  {filters.make ? 'Select Model' : 'Select Make First'}
                </option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              >
                <option value="">All Years</option>
                {Array.from({length: 25}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.condition}
                onChange={(e) => setFilters({...filters, condition: e.target.value})}
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          {/* Other Filters Row */}
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Price (JMD)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Price (JMD)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$999,999"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Seller</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search seller"
                value={filters.seller}
                onChange={(e) => setFilters({...filters, seller: e.target.value})}
              />
            </div>

            <div className="flex items-end col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                />
                <span className="text-sm font-medium flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  Verified Sellers Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading parts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchParts}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No parts found</h3>
            <p className="text-gray-600 mb-6">
              {filters.make || filters.model || filters.year || filters.condition || filters.seller || filters.verifiedOnly
                ? 'Try adjusting your filters to see more results'
                : 'Check back later for new parts listings'}
            </p>
            <button
              onClick={() => setFilters({
                condition: '',
                minPrice: '',
                maxPrice: '',
                seller: '',
                verifiedOnly: false,
                make: '',
                model: '',
                year: ''
              })}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredParts.length} {filteredParts.length === 1 ? 'part' : 'parts'}
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredParts.map(part => (
                <div key={part.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="p-4">
                    {/* Seller Badge */}
                    <div className="mb-3 pb-3 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{part.seller}</span>
                        <SellerBadgeMini
                          verified={part.sellerVerified || false}
                          rating={part.sellerRating || 0}
                          tier={part.sellerTier}
                        />
                      </div>
                    </div>

                    <div className="text-4xl text-center mb-4">{part.image}</div>
                    <h3 className="font-bold text-lg mb-2">{part.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{part.description}</p>

                    <div className="space-y-1 text-sm">
                      {part.vehicle && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="text-right">{part.vehicle}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className={`font-medium ${
                          part.condition === 'new' ? 'text-green-600' :
                          part.condition === 'used' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {part.condition.charAt(0).toUpperCase() + part.condition.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={part.stock > 10 ? 'text-green-600' : 'text-orange-600'}>
                          {part.stock} available
                        </span>
                      </div>
                      {part.partNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Part #:</span>
                          <span className="font-mono text-xs">{part.partNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                          ${(part.price).toLocaleString('en-US')}
                        </span>
                        {part.sellerVerified && (
                          <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(part)}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
