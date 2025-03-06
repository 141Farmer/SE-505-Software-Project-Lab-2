import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
// Import toast library - you'll need to install it first
// npm install react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

    // Set calculated values
    setTotalPrice(totalProductPrice);
    setDeliveryCharge(deliveryCharge);
    setTotalOrderPrice(totalProductPrice + deliveryCharge);

    // Check for payment success query parameter
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('payment') === 'success') {
      // Show success toast
      toast.success('Payment successful! Please confirm your order.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Show confirmation modal
      setShowConfirmModal(true);
    }
  }, [location]);

  const handleConfirmOrder = async () => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('token'); 
    if (!isLoggedIn) {
      alert("Please log in to proceed with the order.");
      navigate('/login'); 
      return;
    }
  
    // Retrieve cartTotalCost from localStorage
    const cartTotalCost = localStorage.getItem('cartTotalPrice');
    if (!cartTotalCost) {
      alert("Your cart is empty. Please add items to your cart.");
      return;
    }
  
    try {
      // Make a POST request to the payment endpoint
      const response = await fetch('http://127.0.0.1:8000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ paymentAmount: cartTotalCost }),
      });
  
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const result = await response.json();
        if (result.success === "true") {
          navigate('/payment-success');
        } else {
          toast.error("Payment request failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during payment request:", error);
      toast.error("An error occurred while processing your payment. Please try again.");
    }
  };

  const handleFinalConfirmation = async () => {
    // Here you would implement the logic to submit the final order
    // This could be a separate API call to create the order in your database
    try {
      // Example API call to create order
      const response = await fetch('http://127.0.0.1:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cartItems,
          totalPrice: totalOrderPrice,
          deliveryCharge: deliveryCharge
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Order placed successfully!');
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTotalPrice');
        // Redirect to order confirmation page
        navigate('/order-confirmation');
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Modal component
  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="mb-6 text-gray-700">Your payment has been processed successfully. Would you like to confirm and place your order now?</p>
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              onClick={handleFinalConfirmation}
              className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar/>
      {/* Add ToastContainer for notifications */}
      <ToastContainer />
      
      {/* Render the confirmation modal */}
      <ConfirmationModal />
      
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