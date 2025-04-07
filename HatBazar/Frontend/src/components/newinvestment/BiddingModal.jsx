import React, { useState } from 'react';

const BidModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bid_investment_principle: '',
    bid_investment_rate: '',
    bid_share_dividing_period_month: '',
    bid_investment_duration_month: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert string values to numbers
    const numericData = {
      bid_investment_principle: parseFloat(formData.bid_investment_principle),
      bid_investment_rate: parseFloat(formData.bid_investment_rate),
      bid_share_dividing_period_month: parseInt(formData.bid_share_dividing_period_month, 10),
      bid_investment_duration_month: parseInt(formData.bid_investment_duration_month, 10),
    };

    // Pass the numeric data to the parent component
    onSubmit(numericData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Add New Bid</h2>
        <form onSubmit={handleSubmit}>
          {/* Investment Principle */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Investment Principle (BDT)</label>
            <input
              type="number"
              name="bid_investment_principle"
              value={formData.bid_investment_principle}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              min="0"
              step="any"
              required
            />
          </div>

          {/* Investment Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Investment Rate (%)</label>
            <input
              type="number"
              name="bid_investment_rate"
              value={formData.bid_investment_rate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              min="0"
              step="any"
              required
            />
          </div>

          {/* Share Dividing Period */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Share Dividing Period (Months)</label>
            <input
              type="number"
              name="bid_share_dividing_period_month"
              value={formData.bid_share_dividing_period_month}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              min="0"
              required
            />
          </div>

          {/* Investment Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Investment Duration (Months)</label>
            <input
              type="number"
              name="bid_investment_duration_month"
              value={formData.bid_investment_duration_month}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              min="0"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Bid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;