import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Check, Plus, Minus, Truck, Package } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Remove an item from the cart
  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.product_id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success("Product removed from cart!");
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.product_id === productId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => 
    total + (item.unit_price * (item.quantity || 1)), 0);

  // Confirm order (placeholder function)
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    toast.success('Order confirmed! Thank you for your purchase.');
    localStorage.removeItem('cart'); // Clear the cart after order confirmation
    setCartItems([]); // Update state to reflect empty cart
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <ShoppingCart className="w-8 h-8" /> Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {cartItems.map((item) => (
                <div 
                  key={item.product_id} 
                  className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{item.product_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Package className="w-4 h-4" />
                        <span>{item.package_detail}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.product_id, (item.quantity || 1) - 1)}
                          className="bg-gray-200 rounded-l-lg px-2 py-1 hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="bg-gray-100 px-3 py-1">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, (item.quantity || 1) + 1)}
                          className="bg-gray-200 rounded-r-lg px-2 py-1 hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-bold text-lg">
                        {(item.unit_price * (item.quantity || 1)).toFixed(2)} tk
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Price and Confirm Order Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Total Items</h3>
                <span className="text-lg text-gray-700">
                  {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)} items
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Total Price</h3>
                <span className="text-2xl font-bold text-green-600">
                  {totalPrice.toFixed(2)} tk
                </span>
              </div>
              <button
                onClick={handleConfirmOrder}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Check className="w-5 h-5 mr-2" /> Confirm Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;