import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeOrderProcess = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        // Get necessary data from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const deliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress'));
        const cartTotalPrice = localStorage.getItem('cartTotalPrice');

        if (!cartItems.length || !deliveryAddress || !cartTotalPrice) {
          throw new Error('Missing order information.');
        }

        // Step 1: Send delivery address to backend
        const deliveryResponse = await fetch('http://127.0.0.1:8000/delivery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(deliveryAddress)
        });

        if (!deliveryResponse.ok) {
          const deliveryData = await deliveryResponse.json();
          throw new Error(deliveryData.message || 'Failed to save delivery information');
        }
        
        // Step 2: Create the order
        const orderResponse = await fetch('http://127.0.0.1:8000/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            items: cartItems,
            totalPrice: parseFloat(cartTotalPrice),
            deliveryAddress: deliveryAddress
          })
        });

        if (!orderResponse.ok) {
          const orderData = await orderResponse.json();
          throw new Error(orderData.message || 'Failed to create order');
        }

        const orderResult = await orderResponse.json();
        setOrderNumber(orderResult.orderNumber || 'N/A');

        // Step 3: Clear local storage
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTotalPrice');
        localStorage.removeItem('deliveryAddress');

        setIsProcessing(false);
        toast.success('Your order has been placed successfully!');
        
      } catch (error) {
        console.error('Error completing order:', error);
        setError(error.message || 'An error occurred while processing your order');
        setIsProcessing(false);
        toast.error(error.message || 'An error occurred while processing your order');
      }
    };

    completeOrderProcess();
  }, []);

  const handleGoToMarketplace = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <ToastContainer />
      
      <div className="container mx-auto px-4 pt-20 pb-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
          {isProcessing ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700">Processing your order...</h2>
              <p className="text-gray-500 mt-2">Please wait while we confirm your details.</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <div className="bg-red-100 p-4 rounded-lg mb-6">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Error</h2>
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={handleGoToMarketplace}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Return to Marketplace
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="bg-green-100 p-6 rounded-full mx-auto w-24 h-24 mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-2 text-lg">Your order has been placed successfully.</p>
              {orderNumber && (
                <p className="text-gray-700 font-medium mb-6">Order Number: <span className="font-bold">{orderNumber}</span></p>
              )}
              <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive a confirmation email shortly with your order details.</p>
              
              <button
                onClick={handleGoToMarketplace}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;