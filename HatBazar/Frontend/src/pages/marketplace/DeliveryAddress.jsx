import React, { useState, useEffect } from 'react';
import { Truck, Check } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const DeliveryAddress = () => {
  const [buildingHouseNo, setBuildingHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      const [building, streetAddr, areaAddr, cityAddr] = savedAddress.split(',');
      setBuildingHouseNo(building.trim());
      setStreet(streetAddr.trim());
      setArea(areaAddr.trim());
      setCity(cityAddr.trim());
    }
  }, []);

  const handleProceedToPayAndOrder = (e) => {
    e.preventDefault();

    if (!buildingHouseNo || !street || !area || !city) {
      alert('Please fill in all address fields');
      return;
    }

    const addressString = `${buildingHouseNo}, ${street}, ${area}, ${city}`;
    localStorage.setItem('deliveryAddress', addressString);

    navigate("/confirm-order");
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <Navbar />
      <div className="w-full max-w-md px-4">
        <div className="flex items-center mb-8">
          <Truck className="w-8 h-8 mr-2 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Delivery Address</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleProceedToPayAndOrder} className="space-y-4">
            <div>
              <label 
                htmlFor="buildingHouseNo" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Building/House No.
              </label>
              <input
                id="buildingHouseNo"
                type="text"
                value={buildingHouseNo}
                onChange={(e) => setBuildingHouseNo(e.target.value)}
                placeholder="Enter building/house number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label 
                htmlFor="street" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street
              </label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter street name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label 
                htmlFor="area" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Area
              </label>
              <input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label 
                htmlFor="city" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Check className="w-5 h-5 mr-2" /> Proceed to Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;