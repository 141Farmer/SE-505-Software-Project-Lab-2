import React, { useState } from 'react';
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingCartButton = ({ cartItems }) => {
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);

  // Toggle cart popup visibility
  const toggleCartPopup = () => {
    setIsCartPopupOpen(!isCartPopupOpen);
  };

  // Function to update item quantity
  const updateQuantity = (productToUpdate, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.product_id === productToUpdate.product_id
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    ).filter(item => item.quantity > 0);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.location.reload();
  };

  // Calculate total cart items
  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Floating Cart Button */}
      <button
        onClick={toggleCartPopup}
        className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
      >
        <ShoppingCart className="w-8 h-8 text-white" />
        {totalCartItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {totalCartItems}
          </span>
        )}
      </button>

      {/* Cart Popup */}
      {isCartPopupOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Cart</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.product_id} className="flex items-center gap-4">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h4 className="text-sm font-semibold text-gray-900">{item.product_name}</h4>
                    <p className="text-xs text-gray-600">{item.unit_price} tk</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {cartItems.length > 3 && (
                <p className="text-sm text-gray-600">+ {cartItems.length - 3} more items...</p>
              )}
              <Link
                to="/cart"
                className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
              >
                <span>View Cart</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingCartButton;