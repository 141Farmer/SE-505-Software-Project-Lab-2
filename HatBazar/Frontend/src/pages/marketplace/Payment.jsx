import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Payment = ({ cartItems, totalPrice, deliveryAddress, onNext }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // e.preventDefault();
    // if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
    //   toast.error('Please fill in all payment details.');
    //   return;
    // }
    // onNext({ paymentDetails });
    na
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter card number"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                value={paymentDetails.expiryDate}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="MM/YY"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={paymentDetails.cvv}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter CVV"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Proceed to Order Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;