'use client';

import { useState, useRef, useCallback } from 'react';
import { formatJMD } from '@/lib/currency';
import { useRouter } from 'next/navigation';
import { Camera, Upload, X, Search, AlertCircle, CheckCircle, Package, ImageIcon } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  confidence: number;
  price: number;
  seller: string;
  sellerVerified: boolean;
  image: string;
  condition: string;
  stock: number;
  vehicle?: string;
}

export default function VisualSearchPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
    }

    if (file.size > maxSize) {
      return `File size must be less than 10MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleSearch = async () => {
    if (!selectedFile) return;

    setIsSearching(true);
    setUploadProgress(0);
    setSearchResults([]);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simulate API call (replace with actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock results with more realistic data
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: 'Brake Rotor - Front Premium',
          confidence: 95,
          price: 12999,
          seller: 'AutoParts Pro Kingston',
          sellerVerified: true,
          image: '🔧',
          condition: 'new',
          stock: 5,
          vehicle: 'Universal Fit'
        },
        {
          id: '2',
          name: 'Performance Drilled Brake Rotor',
          confidence: 88,
          price: 15999,
          seller: 'Speed Shop Jamaica',
          sellerVerified: true,
          image: '🔧',
          condition: 'new',
          stock: 3,
          vehicle: 'Sports Cars'
        },
        {
          id: '3',
          name: 'OEM Replacement Brake Rotor',
          confidence: 82,
          price: 9999,
          seller: 'Factory Direct MoBay',
          sellerVerified: false,
          image: '🔧',
          condition: 'new',
          stock: 10,
          vehicle: 'Toyota/Honda'
        },
        {
          id: '4',
          name: 'Economy Brake Rotor Set',
          confidence: 75,
          price: 7999,
          seller: 'Budget Auto Parts',
          sellerVerified: true,
          image: '🔧',
          condition: 'new',
          stock: 15,
          vehicle: 'Most Vehicles'
        }
      ];

      setUploadProgress(100);
      setTimeout(() => {
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 500);

    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search. Please try again.');
      setIsSearching(false);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const resetSearch = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setSearchResults([]);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRequestPart = () => {
    router.push('/request-part');
  };

  const viewPartDetails = (result: SearchResult) => {
    router.push(`/marketplace?search=${encodeURIComponent(result.name)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Visual Part Search</h1>
            <p className="text-gray-600">
              Upload a photo of any auto part and our AI will find matching parts instantly
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {!selectedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Part Image</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your image here, or click to browse
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 transition"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Choose from Device
                  </label>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2 transition"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </label>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  Supported formats: JPG, PNG, GIF, WebP • Max size: 10MB
                </p>
              </div>
            ) : (
              <div>
                {/* Image Preview */}
                <div className="relative mb-6">
                  <img
                    src={selectedImage}
                    alt="Uploaded part"
                    className="max-w-full h-64 object-contain mx-auto rounded-lg bg-gray-100"
                  />
                  <button
                    onClick={resetSearch}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* File Info */}
                {selectedFile && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {isSearching && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Analyzing image...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 transition"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search for Similar Parts
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetSearch}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-flex items-center gap-2 transition"
                  >
                    <Upload className="w-5 h-5" />
                    Upload New Image
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Found {searchResults.length} Matching Parts
                </h2>
                <button
                  onClick={resetSearch}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  New Search
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {searchResults.map(result => (
                  <div key={result.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl bg-gray-100 p-3 rounded-lg">{result.image}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{result.name}</h3>
                            <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                              result.confidence >= 90 ? 'bg-green-100 text-green-800' :
                              result.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {result.confidence}% Match
                            </span>
                          </div>

                          <div className="space-y-1 text-sm mb-3">
                            <p className="text-2xl font-bold text-blue-600">
                              JMD ${result.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Seller:</span>
                              <span className="font-medium">{result.seller}</span>
                              {result.sellerVerified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-gray-600">
                              Condition: <span className="font-medium capitalize">{result.condition}</span>
                            </p>
                            <p className="text-gray-600">
                              Stock: <span className={`font-medium ${
                                result.stock > 5 ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                {result.stock} available
                              </span>
                            </p>
                            {result.vehicle && (
                              <p className="text-gray-600">
                                Fits: <span className="font-medium">{result.vehicle}</span>
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => viewPartDetails(result)}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No exact match CTA */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <Package className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Can't find the exact part?</h3>
                <p className="text-gray-600 mb-4">
                  Submit a part request and let sellers find it for you
                </p>
                <button
                  onClick={handleRequestPart}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Request This Part
                </button>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-12 bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">How AI Visual Search Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">1. Upload Image</h3>
                <p className="text-sm text-gray-600">
                  Take or upload a clear photo of the part
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">2. AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our AI identifies the part type and features
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-medium mb-2">3. Match Parts</h3>
                <p className="text-sm text-gray-600">
                  Find similar parts from our marketplace
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">4. Get Results</h3>
                <p className="text-sm text-gray-600">
                  View matches ranked by confidence score
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Tips for Best Results:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use good lighting and avoid shadows</li>
                <li>• Include the entire part in the frame</li>
                <li>• Show any visible part numbers or labels</li>
                <li>• Take photos from multiple angles if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
