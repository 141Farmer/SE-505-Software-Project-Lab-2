import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { FaCheckCircle, FaBox, FaClock, FaTruck, FaArrowRight } from 'react-icons/fa';

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get order ID from URL parameters if available
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');

    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          // Fetch order details from the backend
          const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOrderDetails(data);
          } else {
            console.error('Failed to fetch order details');
            // Use fallback data from localStorage
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const totalPrice = parseFloat(localStorage.getItem('cartTotalPrice') || '0');
            
            setOrderDetails({
              orderId: orderId || 'Unknown',
              date: new Date().toLocaleDateString(),
              items: cartItems,
              totalAmount: totalPrice,
              status: 'Processing',
              estimatedDelivery: getEstimatedDeliveryDate()
            });
          }
        } else {
          // Use fallback data from localStorage if no orderId
          const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
          const totalPrice = parseFloat(localStorage.getItem('cartTotalPrice') || '0');
          
          setOrderDetails({
            orderId: 'Order placed successfully',
            date: new Date().toLocaleDateString(),
            items: cartItems,
            totalAmount: totalPrice,
            status: 'Processing',
            estimatedDelivery: getEstimatedDeliveryDate()
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
        // Clear cart and total price from localStorage after successful order
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTotalPrice');
      }
    };

    fetchOrderDetails();
  }, [location]);

  // Helper function to calculate estimated delivery date (3-5 days from now)
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // Minimum 3 days
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5); // Maximum 5 days
    
    return `${date.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          {/* Order Confirmation Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-6xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Thank You for Your Order!</h1>
            <p className="text-gray-600 mt-2">
              Your order has been placed successfully. We'll send you a confirmation email shortly.
            </p>
          </div>
          
          {/* Order Details */}
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <p className="text-gray-600">Order Date: {orderDetails?.date}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Order ID:</p>
                <p className="font-bold text-gray-900">{orderDetails?.orderId}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Items Ordered</h3>
              <div className="space-y-4">
                {orderDetails?.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      {item.product_image && (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">{item.package_detail}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {(item.unit_price * item.quantity).toFixed(2)} tk
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Total Amount</h3>
              <span className="text-2xl font-bold text-green-600">
                {orderDetails?.totalAmount?.toFixed(2)} tk
              </span>
            </div>
          </div>
          
          {/* Order Progress */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-green-300"></div>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Order Placed</h4>
                    <p className="text-sm text-gray-600">{orderDetails?.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                    <FaBox className="text-white text-sm" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Order Processing</h4>
                    <p className="text-sm text-gray-600">We're preparing your order</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                    <FaClock className="text-gray-600 text-sm" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Preparing for Shipment</h4>
                    <p className="text-sm text-gray-600">Your order will be shipped soon</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                    <FaTruck className="text-gray-600 text-sm" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Out for Delivery</h4>
                    <p className="text-sm text-gray-600">Estimated delivery: {orderDetails?.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/orders"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 ease-in-out"
            >
              Track Your Order
              <FaArrowRight className="text-sm" />
            </Link>
            
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-200 ease-in-out"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;