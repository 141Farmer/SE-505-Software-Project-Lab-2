import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve cart items from local storage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);

    // Calculate total price
    const totalProductPrice = savedCart.reduce((total, product) => {
      return total + (product.unit_price * product.quantity);
    }, 0);

    // Calculate delivery charge
    const totalQuantity = savedCart.reduce((total, product) => total + product.quantity, 0);
    const deliveryCharge = totalQuantity <= 5 ? 50 : 50 + Math.ceil((totalQuantity - 5) / 5) * 25;

    localStorage.setItem("cartTotalPrice", totalProductPrice + deliveryCharge)
    // Set calculated values
    setTotalPrice(totalProductPrice);
    setDeliveryCharge(deliveryCharge);
    setTotalOrderPrice(totalProductPrice + deliveryCharge);
  }, []);

  const handleConfirmOrder = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to proceed with the order.");
      navigate('/login');
      return;
    }
  
    // Retrieve cart total
    const cartTotalCost = localStorage.getItem('cartTotalPrice');
    if (!cartTotalCost) {
      alert("Your cart is empty. Please add items to your cart.");
      return;
    }
  
    try {
  
      const redirectResponse = await fetch(`http://127.0.0.1:8000/payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_amount: parseFloat(cartTotalCost) }),
      });
  
      if (!redirectResponse.ok) {
        throw new Error(`Redirect request failed: ${redirectResponse.statusText}`);
      }
  
      const redirectData = await redirectResponse.json();
      
      if (redirectData.url) {
        window.location.href = redirectData.url;
    } else {
        throw new Error("No redirect URL received");
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      alert(`Payment processing error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          Confirm Order
        </h1>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {cartItems.map((product) => (
              <div 
                key={product.product_id} 
                className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0"
              >
                <div className="flex items-center gap-4 flex-grow">
                  <img 
                    src={product.product_image} 
                    alt={product.product_name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{product.product_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>{product.package_detail}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600">Quantity: {product.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold text-lg">
                      {(product.unit_price * product.quantity).toFixed(2)} tk
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Total Items</h3>
              <span className="text-lg text-gray-700">
                {cartItems.reduce((total, item) => total + item.quantity, 0)} items
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Total Product Price</h3>
              <span className="text-lg text-gray-700">
                {totalPrice.toFixed(2)} tk
              </span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Delivery Charge</h3>
              <span className="text-lg text-gray-700">
                {deliveryCharge.toFixed(2)} tk
              </span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Total Order Price</h3>
              <span className="text-2xl font-bold text-green-600">
                {totalOrderPrice.toFixed(2)} tk
              </span>
            </div>
            
            <button
              onClick={handleConfirmOrder}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Confirm Order and Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;