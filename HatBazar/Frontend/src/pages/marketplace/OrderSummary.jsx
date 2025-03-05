import React from 'react';
import { ShoppingCart, Truck, CreditCard, MapPin, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ checkoutData, onConfirmOrder }) => {
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = checkoutData.cartItems.reduce((total, item) => 
    total + (item.unit_price * (item.quantity || 1)), 0);

  const handleConfirmOrder = () => {
    // Perform any final order processing
    onConfirmOrder();
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <ShoppingCart className="mr-3 text-green-600" /> Order Items
          </h2>
          {checkoutData.cartItems.map((item) => (
            <div 
              key={item.product_id} 
              className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.product_name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity || 1}</p>
                </div>
              </div>
              <span className="text-green-600 font-bold">
                {(item.unit_price * (item.quantity || 1)).toFixed(2)} tk
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span className="text-green-600">{totalPrice.toFixed(2)} tk</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <MapPin className="mr-3 text-green-600" /> Delivery Address
          </h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {checkoutData.deliveryAddress.fullName}</p>
            <p><strong>Phone:</strong> {checkoutData.deliveryAddress.phoneNumber}</p>
            <p><strong>Address:</strong> {checkoutData.deliveryAddress.streetAddress}</p>
            <p>
              {checkoutData.deliveryAddress.city} 
              {checkoutData.deliveryAddress.postalCode && `, ${checkoutData.deliveryAddress.postalCode}`}
            </p>
            {checkoutData.deliveryAddress.additionalInfo && (
              <p><strong>Additional Info:</strong> {checkoutData.deliveryAddress.additionalInfo}</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <CreditCard className="mr-3 text-green-600" /> Payment Method
          </h2>
          <div className="flex items-center">
            {checkoutData.paymentMethod.icon}
            <span className="ml-3 font-semibold">{checkoutData.paymentMethod.name}</span>
          </div>
        </div>

        {/* Confirm Order Button */}
        <button
          onClick={handleConfirmOrder}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out"
        >
          <Check className="mr-2" /> Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;