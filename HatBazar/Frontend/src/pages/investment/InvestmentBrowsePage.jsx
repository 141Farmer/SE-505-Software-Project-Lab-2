import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SubNavbar from '../../components/SubNavbar/SubNavbar';
import HandleNegotiate from '../../components/investment/HandleNegotiate';

function InvestmentBrowsePage() {
  // State for the current tab
  const [currentTab, setCurrentTab] = useState('browse');

  // State for active offers fetched from the backend
  const [activeOffers, setActiveOffers] = useState([]);

  // State for negotiation inputs
  const [negotiationInputs, setNegotiationInputs] = useState({});

  // Fetch offers from the backend when the component mounts
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/getoffer/');
        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }
        const data = await response.json();
        setActiveOffers(data); // Update state with fetched offers
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  // Handle input changes for negotiations
  const handleInputChange = (offerId, field, value) => {
    setNegotiationInputs((prevInputs) => ({
      ...prevInputs,
      [offerId]: {
        ...prevInputs[offerId],
        [field]: value
      }
    }));
  };

  // Render the offers
  const renderOffers = () => (
    <div>
      {activeOffers.map((offer) => (
        <div
          key={offer.id}
          className="p-4 mb-4 border rounded-lg bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold">{offer.user_name}</h2>
          <p>Principle: ${offer.offer_investment_principle}</p>
          <p>Duration: {offer.offer_investment_duration_month} months</p>
          <p>Profit Rate: {offer.offer_investment_rate}%</p>
          <p>Details: {offer.offer_description}</p>
          <p>Date: {new Date(offer.offer_creation_time).toLocaleDateString()}</p>

          {/* Negotiation Form */}
          <div className="mt-4 space-y-2">
            <input
              type="number"
              placeholder="Proposed Principle"
              value={negotiationInputs[offer.id]?.proposedPrinciple || ""}
              onChange={(e) =>
                handleInputChange(offer.id, "proposedPrinciple", e.target.value)
              }
              className="border p-2 w-full rounded-md"
            />
            <input
              type="number"
              placeholder="Proposed Duration (months)"
              value={negotiationInputs[offer.id]?.proposedDuration || ""}
              onChange={(e) =>
                handleInputChange(offer.id, "proposedDuration", e.target.value)
              }
              className="border p-2 w-full rounded-md"
            />
            <input
              type="number"
              placeholder="Proposed Rate (%)"
              value={negotiationInputs[offer.id]?.proposedRate || ""}
              onChange={(e) =>
                handleInputChange(offer.id, "proposedRate", e.target.value)
              }
              className="border p-2 w-full rounded-md"
            />
            <button
              onClick={() =>
                HandleNegotiate(offer.id, negotiationInputs, setActiveOffers, setNegotiationInputs)
              }
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Negotiate
            </button>
          </div>

          {/* Negotiations */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold">Negotiations:</h3>
            {offer.negotiations && offer.negotiations.length > 0 ? (
              offer.negotiations.map((negotiation) => (
                <div
                  key={negotiation.id}
                  className="text-sm text-gray-600 border-t mt-2 pt-2"
                >
                  <strong>{negotiation.negotiator}:</strong> Proposed Principle: ${negotiation.proposedPrinciple}, Duration: {negotiation.proposedDuration} months, Rate: {negotiation.proposedRate}%
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No negotiations yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-green-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="fixed top-16 left-0 right-0 z-40 bg-white shadow-sm">
        <SubNavbar currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          {currentTab === 'browse' && renderOffers()}
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export default InvestmentBrowsePage;