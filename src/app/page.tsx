'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronRight, Phone, Check, Truck, Shield, Clock, Search, FileText, Camera, MessageSquare, Car, Wrench, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleMakes, getModelsForMake, getYearRange } from '@/lib/vehicleData'

export default function HomePage() {
  const router = useRouter()
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: ''
  })
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [vinNumber, setVinNumber] = useState('')
  const [vinLoading, setVinLoading] = useState(false)
  const [vinError, setVinError] = useState('')

  useEffect(() => {
    if (vehicleData.make) {
      const models = getModelsForMake(vehicleData.make)
      setAvailableModels(models)
    } else {
      setAvailableModels([])
    }
  }, [vehicleData.make])

  const handleMakeChange = (make: string) => {
    setVehicleData({ ...vehicleData, make, model: '' })
  }

  const handleSearch = () => {
    if (vehicleData.make) {
      router.push(`/marketplace?make=${vehicleData.make}&model=${vehicleData.model}&year=${vehicleData.year}`)
    }
  }

  const handleVinDecode = async () => {
    if (vinNumber.length === 17) {
      setVinLoading(true)
      setVinError('')
      try {
        // First try NHTSA API
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vinNumber}?format=json`)
        const data = await response.json()

        if (data.Results && data.Results[0]) {
          const result = data.Results[0]
          const make = result.Make || ''
          const model = result.Model || ''
          const year = result.ModelYear || ''

          if (make && year) {
            setVehicleData({
              make,
              model: model || 'Unknown Model',
              year: year.toString()
            })
            setVinError('')
          } else {
            // Fallback to local API for non-US VINs
            const localResponse = await fetch(`/api/vin?vin=${vinNumber}`)
            const localData = await localResponse.json()
            if (localData.success) {
              setVehicleData({
                make: localData.data.make,
                model: localData.data.model,
                year: localData.data.year.toString()
              })
            } else {
              setVinError('VIN not found. Please check and try again.')
            }
          }
        }
      } catch (error) {
        setVinError('Unable to decode VIN. Please enter vehicle details manually.')
      } finally {
        setVinLoading(false)
      }
    }
  }

  const years = getYearRange()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner with Phone and Reviews */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="tel:1-876-219-3329" className="text-3xl font-bold text-blue-600 hover:text-blue-700">
                1876 219 3329
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">2,847 Customer Reviews</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <a href="#reviews" className="text-blue-600 hover:underline text-sm">(read)</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative">
        {/* Background with luxury cars */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-95"></div>
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600"
            alt="Luxury cars"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Side - Vehicle Selector */}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Select <span className="text-gray-700">Your Vehicle</span>
              </h1>
              <h2 className="text-3xl mb-8">
                & Find The <span className="text-green-600">Right Parts.</span>
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg">
                <p className="text-red-700 mb-4">Please select your car</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-red-800 font-bold mb-2">MAKE:</label>
                    <select
                      value={vehicleData.make}
                      onChange={(e) => handleMakeChange(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select your vehicle make</option>
                      {vehicleMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-red-800 font-bold mb-2">MODEL:</label>
                    <select
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      disabled={!vehicleData.make}
                    >
                      <option value="">
                        {!vehicleData.make
                          ? 'Select a make first'
                          : availableModels.length === 0
                          ? 'Loading models...'
                          : 'Select your vehicle model'}
                      </option>
                      {availableModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-red-800 font-bold mb-2">YEAR:</label>
                    <select
                      value={vehicleData.year}
                      onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    Search Parts for This Vehicle
                  </button>


                </div>
              </div>

              {/* Features Row */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-4">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-bold text-sm">QUICK</h3>
                    <p className="text-xs text-gray-600">Find Quality New & Used Parts in Minutes!</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-sm">SAVE</h3>
                    <p className="text-xs text-gray-600">Save upto 80%</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-4">
                    <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-bold text-sm">DELIVERY</h3>
                    <p className="text-xs text-gray-600">Island-wide Delivery Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Call to Action */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <img
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600"
                  alt="Auto parts"
                  className="rounded-lg shadow-xl mb-6 max-w-full"
                />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-6xl font-bold text-red-600">START HERE</span>
                  <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>

              <div className="bg-red-600 text-white rounded-lg p-6 shadow-xl max-w-sm">
                <h3 className="text-2xl font-bold mb-2">FIND CHEAPEST CAR PARTS</h3>
                <p className="text-lg mb-4">GUARANTEED</p>
                <Link href="/marketplace" className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 inline-block">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* VIN Registration Section */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2">
              Enter Your Vehicle <span className="text-gray-600">Registration</span>
            </h2>
            <h3 className="text-2xl mb-6">
              & Find The <span className="text-green-600">Right Parts.</span>
            </h3>

            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-gray-700 font-bold mb-2">
                <Wrench className="inline w-5 h-5 mr-2" />
                VIN DECODER (Works with all VINs including BMW, Mercedes, etc):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 17-digit VIN (e.g., WBAFH62010L870435)"
                  value={vinNumber}
                  onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                  maxLength={17}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleVinDecode}
                  disabled={vinLoading || vinNumber.length !== 17}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  {vinLoading ? 'Decoding...' : 'Decode VIN'}
                </button>
              </div>
              {vinError && <p className="text-red-600 text-sm mt-2">{vinError}</p>}
              {vehicleData.make && vinNumber && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Vehicle identified: {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ... rest of the page content remains the same ... */}
    </div>
  )
}
