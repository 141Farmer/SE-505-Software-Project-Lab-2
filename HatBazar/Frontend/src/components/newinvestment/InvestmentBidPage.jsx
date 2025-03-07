import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddBidButton from './AddBidButton';
const InvestmentBidPage = () => {
  const { offer_id } = useParams(); // Extract offer_id from the URL

  const [bids, setBids] = useState([]); // State to store the fetched bids
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch bid details based on offer_id
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/getbid/${offer_id}/`);
        console.log('Response:', response); // Log the response

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Data:', data); // Log the fetched data
          setBids(data); // Update state with fetched bids (array)
        } else {
          setError('Failed to fetch bid details');
          console.log('Response Status:', response.status); // Log the status code
        }
      } catch (error) {
        setError('Error fetching bid details');
        console.error('Error:', error); // Log the error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBids();
  }, [offer_id]);

  return (
    <div className="bg-green-200 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-6">
        Investment Bid Details
      </h1>

      {/* Loading and Error Handling */}
      {loading ? (
        <p className="text-gray-700 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <div className="w-full max-w-4xl">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <div key={bid.bid_id} className="bg-white rounded-md border border-green-300 p-6 mb-4 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">Bid Details</h2>
                <div className="text-gray-800 space-y-2">
                  <p><strong>Bided by:</strong> {bid.user_name}</p>
                  <p><strong>Principle:</strong> ${bid.bid_investment_principle}</p>
                  <p><strong>Rate:</strong> {bid.bid_investment_rate}%</p>
                  <p><strong>Share dividing period:</strong> {bid.bid_share_dividing_period_month} months</p>
                  <p><strong>Duration month:</strong> {bid.bid_investment_duration_month} months</p>
                  <p><strong>Bid Creation Time:</strong> {new Date(bid.bid_creation_time).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No bid details found.</p>
          )}
        </div>
      )}
      <AddBidButton offerId={offer_id} />
    </div>
  );
};

export default InvestmentBidPage;
