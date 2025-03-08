import React, { useEffect, useState } from "react";
import { Clock, Plus } from "lucide-react"; // Import Plus icon
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import OfferModal from "../../components/newinvestment/OfferModal";


const InvestmentOfferBrowsePage = () => {
  const [offers, setOffers] = useState([]); // State to store investment offers
  const [userRole, setUserRole] = useState(null); // State to store user role
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for modal
  const navigate = useNavigate(); // Hook for navigation
  
  // Fetch user role from the backend
  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetch("http://127.0.0.1:8000/user-role", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserRole(data.role);
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  // Fetch investment offers from the backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/getoffer/"); // Replace with your backend endpoint
        if (response.ok) {
          const data = await response.json();
          setOffers(data); // Update state with fetched offers
        } else {
          console.error("Failed to fetch offers");
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
    checkUserRole(); // Fetch user role on component mount
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

  // Handle navigation to bids page
  const handleBidsClick = (offer_id) => {
    navigate(`/bids/${offer_id}`); // Navigate to the BidsPage with the offer ID
  };

  // Handle navigation to accept offer page
  const handleAcceptOffer = (offer) => {
    navigate(`/accept-offer/${offer.offer_id}`, { state: { offer } }); // Pass offer via state
  };

  const handleAddOffer = async (investmentOffer) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      console.log(investmentOffer);
      const response = await fetch("http://127.0.0.1:8000/postoffer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(investmentOffer),
      });
      console.log(response);

      if (response.ok) {
        const newOffer = await response.json();
        setOffers((prev) => [...prev, newOffer]); // Update state with the new offer
      } else {
        console.error("Failed to add offer");
      }
    } catch (error) {
      console.error("Error adding offer:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      <div className="pt-20 p-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-6">
          Investment Offers
        </h1>

        {userRole === "farm" && (
        <button
          className="mb-8 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Investment Offer
        </button>
      )}

      {/* Offer Modal (Rendered Only Once) */}
      <OfferModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddOffer}
      />

        {/* Offers List */}
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.offer_id}
              className="bg-white rounded-md border border-gray-300 mb-6 hover:border-gray-400 transition-colors"
            >
              <div className="p-6">
                {/* Offer Metadata */}
                <div className="text-sm text-gray-500 mb-3 flex items-center">
                  <span>Posted by {offer.user_name}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(offer.offer_creation_time)}
                  </span>
                </div>

                {/* Offer Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {offer.offer_description}
                </h3>

                {/* Offer Details */}
                <div className="text-gray-800 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="mb-2">
                    <strong>Investment Principle:</strong> $
                    {offer.offer_investment_principle}
                  </p>
                  <p className="mb-2">
                    <strong>Investment Rate:</strong> {offer.offer_investment_rate}%
                  </p>
                  <p className="mb-2">
                    <strong>Share Dividing Period:</strong>{" "}
                    {offer.offer_share_dividing_period_month} months
                  </p>
                  <p>
                    <strong>Investment Duration:</strong>{" "}
                    {offer.offer_investment_duration_month} months
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleBidsClick(offer.offer_id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Bids
                  </button>
                  <button
                    onClick={() => handleAcceptOffer(offer)}
                    className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                  >
                    Accept Offer
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No investment offers found.</p>
        )}
      </div>

      
    </div>
  );
};

export default InvestmentOfferBrowsePage;