import React from "react";
import { CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

const InvestmentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        
        <h1 className="text-3xl font-bold text-green-600">
          Investment Successful!
        </h1>
        
        <p className="text-gray-600 px-4">
          Your investment has been successfully processed. Thank you for your trust in us!
        </p>
        
        <button
          onClick={() => (window.location.href = "/newinvestment")}
          className="w-full py-3 bg-green-600 text-white rounded-lg 
                     hover:bg-green-700 transition duration-200 focus:outline-none"
        >
          Go to Investmant Page
        </button>
      </div>
    </div>
  );
};

export default InvestmentSuccess;