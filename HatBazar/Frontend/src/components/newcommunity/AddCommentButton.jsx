import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PostModal from './PostModal'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom'; // For navigation

const AddCommentButton = () => {
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

  const handleSubmit = async (postData) => {
    try {
      const token = localStorage.getItem('authToken'); // Get the token for authorization
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        window.location.reload(); // Reload the page to reflect the new post
      } else {
        console.error('Failed to submit post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
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
        aria-label="Create new post"
      >
        <Plus size={35} />
      </button>
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddCommentButton;