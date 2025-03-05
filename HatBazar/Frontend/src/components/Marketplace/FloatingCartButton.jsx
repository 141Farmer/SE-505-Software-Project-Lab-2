import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingCartButton = ({ cartItems }) => {
  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link
        to="/cart"
        className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
      >
        <ShoppingCart className="w-8 h-8 text-white" />
        {totalCartItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {totalCartItems}
          </span>
        )}
      </Link>
    </div>
  );
};

export default FloatingCartButton;