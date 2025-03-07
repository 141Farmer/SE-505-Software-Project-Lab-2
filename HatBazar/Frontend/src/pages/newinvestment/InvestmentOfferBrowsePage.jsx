import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';



const InvestmentOfferBrowsePage = () => {
  const [offers, setOffers] = useState([]); // State to store investment offers
  const navigate = useNavigate(); // Hook for navigation

  const handleBidsClick = (offer_id) => {
    navigate(`/bids/${offer_id}`); // Navigate to the CommentsPage with the post ID
  };

  const handleAcceptOffer = (offer) => {
    navigate(`/accept-offer/${offer.offer_id}`, { state: { offer } }); // Pass offer via state
  };

  // Fetch investment offers from the backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/getoffer/'); // Replace with your backend endpoint
        if (response.ok) {
          const data = await response.json();
          setOffers(data); // Update state with fetched offers
        } else {
          console.error('Failed to fetch offers');
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  // Format the offer creation time to a readable format
  const formatTime = (timestamp) => {
    const posted = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return posted.toLocaleDateString();
  };

  
  

  return (
    <div className="p-4 bg-green-100">
          <Navbar />
          <div className="pt-20 p-8">
                    <h1 className="text-4xl font-bold text-center text-green-800 mb-6">
                              Investment Offers
                    </h1>
          </div>
      
      {offers.length > 0 ? (
        offers.map((offer) => (
          <div key={offer.offer_id} className="bg-white rounded-md border border-gray-300 mb-4 hover:border-gray-400 transition-colors">
            <div className="p-4">
              {/* Offer metadata */}
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <span>Posted by {offer.user_name}</span>
                <span className="mx-1">•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(offer.offer_creation_time)}
                </span>
              </div>

              {/* Offer description */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{offer.offer_description}</h3>

              {/* Offer details */}
              <div className="text-gray-800 mb-4 bg-gray-50 p-3 rounded border border-gray-200">
                <p><strong>Investment Principle:</strong> ${offer.offer_investment_principle}</p>
                <p><strong>Investment Rate:</strong> {offer.offer_investment_rate}%</p>
                <p><strong>Share Dividing Period:</strong> {offer.offer_share_dividing_period_month} months</p>
                <p><strong>Investment Duration:</strong> {offer.offer_investment_duration_month} months</p>
              </div>

              {/* Details button */}
              <div className="flex justify-end space-x-2">
                    <button
                              onClick={() => handleBidsClick(offer.offer_id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                              Bids of Investment
                    </button>
                    <button
                              onClick={() => handleAcceptOffer(offer)} // Pass offer_id via URL
                              className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                              Accept Offer
                    </button>
                    </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No investment offers found.</p>
      )}
    </div>
  );
};

export default InvestmentOfferBrowsePage;