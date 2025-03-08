import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BidModal from './BiddingModal'; // Import the BidModal component
import { useNavigate } from 'react-router-dom'; // For navigation

const AddBidButton = ({ offerId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Check if the user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token'); // Assuming you store a token on login
    return !!token; // Returns true if token exists, false otherwise
  };

  const handleClick = () => {
    if (!isLoggedIn()) {
      navigate('/login'); // Redirect to the login page if not logged in
    } else {
      setIsModalOpen(true); // Open the modal if logged in
    }
  };

  const handleSubmit = async (bidData) => {
    try {
      const token = localStorage.getItem('token'); 
          console.log(bidData);
      if(!token){
          navigate('/login')
      }
      const response = await fetch(`http://127.0.0.1:8000/makebid/${offerId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify(bidData),
      });
      console.log(response);

      if (response.ok) {
        setIsModalOpen(false); // Close the modal
        window.location.reload(); // Reload the page to reflect the new bid
      } else {
        console.error('Failed to submit bid');
      }

      


    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 p-4 bg-green-600 hover:bg-green-700 
                   text-white rounded-full shadow-lg transition-all duration-300 
                   transform hover:scale-110 focus:outline-none focus:ring-2 
                   focus:ring-green-500 focus:ring-opacity-50"
        aria-label="Add new bid"
      >
        <Plus size={35} />
      </button>
      <BidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddBidButton;