import React from "react";
import { Slash } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

const PaymentCancelledPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full space-y-6">
        <Slash className="w-16 h-16 text-red-500 mx-auto" />
        
        <h1 className="text-3xl font-bold text-red-600">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 px-4">
          Your payment was successfully cancelled. You can return to your cart to review your order or continue shopping.
        </p>
        
        <button
          onClick={() => (window.location.href = "/cart")}
          className="w-full py-3 bg-red-600 text-white rounded-lg 
                     hover:bg-red-700 transition duration-200 focus:outline-none"
        >
          Return to Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;