import React, { useState } from 'react';
import { MapPin, User, Phone, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeliveryAddress = ({ checkoutData, onAddressSubmit }) => {
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    additionalInfo: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!address.fullName || !address.phoneNumber || !address.streetAddress) {
      alert('Please fill in all required fields');
      return;
    }

    onAddressSubmit(address);
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MapPin className="mr-3 text-green-600" /> Delivery Address
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center mb-2">
              <User className="mr-2 text-gray-500" /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="flex items-center mb-2">
              <Phone className="mr-2 text-gray-500" /> Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={address.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="flex items-center mb-2">
              <Building className="mr-2 text-gray-500" /> Street Address
            </label>
            <input
              type="text"
              name="streetAddress"
              value={address.streetAddress}
              onChange={handleInputChange}
              placeholder="Enter street address"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={address.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional delivery instructions"
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryAddress;