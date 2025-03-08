import React from "react";
import { XCircle } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

const PaymentFailurePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full space-y-6">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        
        <h1 className="text-3xl font-bold text-red-600">
          Order Failed
        </h1>
        
        <p className="text-gray-600 px-4">
          There was an issue processing your order. Please verify your payment details and try again later.
        </p>
        
        <button
          onClick={() => (window.location.href = "/confirm-order")}
          className="w-full py-3 bg-red-600 text-white rounded-lg 
                     hover:bg-red-700 transition duration-200 focus:outline-none"
        >
          Retry Payment & Confirm Order
        </button>
      </div>
    </div>
  );
};

export default PaymentFailurePage;