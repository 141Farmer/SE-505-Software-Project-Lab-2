import React, { useState } from "react";

const OfferModal = ({ isOpen, onClose, onSubmit }) => {
  const [investmentOffer, setInvestmentOffer] = useState({
    offer_description: "",
    offer_investment_principle: "",
    offer_investment_rate: "",
    offer_share_dividing_period_month: "",
    offer_investment_duration_month: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestmentOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
          e.preventDefault();
      
          // Convert string values to numbers
          const formattedData = {
            offer_description: investmentOffer.offer_description,
            offer_investment_principle: parseFloat(investmentOffer.offer_investment_principle),
            offer_investment_rate: parseFloat(investmentOffer.offer_investment_rate),
            offer_share_dividing_period_month: parseInt(investmentOffer.offer_share_dividing_period_month, 10),
            offer_investment_duration_month: parseInt(investmentOffer.offer_investment_duration_month, 10),
          };
      
          // Pass the numeric data to the parent component
          onSubmit(formattedData);
          onClose();
        };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Offer</h2>
        <form onSubmit={handleSubmit}>
          {/* Offer Description */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Offer Description
            </label>
            <input
              type="text"
              name="offer_description"
              value={investmentOffer.offer_description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Investment Principle */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Investment Principle ($)
            </label>
            <input
              type="number"
              name="offer_investment_principle"
              value={investmentOffer.offer_investment_principle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Investment Rate */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Investment Rate (%)
            </label>
            <input
              type="number"
              name="offer_investment_rate"
              value={investmentOffer.offer_investment_rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Share Dividing Period */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Share Dividing Period (Months)
            </label>
            <input
              type="number"
              name="offer_share_dividing_period_month"
              value={investmentOffer.offer_share_dividing_period_month}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Investment Duration */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Investment Duration (Months)
            </label>
            <input
              type="number"
              name="offer_investment_duration_month"
              value={investmentOffer.offer_investment_duration_month}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferModal;