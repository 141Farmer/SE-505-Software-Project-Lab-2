import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CommentModal from './CommentModal'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom'; // For navigation

const AddCommentButton = ({postId}) => {
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

  const handleSubmit = async (commentData) => {
          const hardcodedData = {
                    post_id: Number(postId),
                    comment: commentData.comment,
                  };
    try {
      const token = localStorage.getItem('token'); // Get the token for authorization
      const response = await fetch('http://127.0.0.1:8000/commentpost/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify(hardcodedData),
      });
      console.log(hardcodedData);

      if (response.ok) {
        window.location.reload(); // Reload the page to reflect the new post
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
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
        aria-label="Create new comment"
      >
        <Plus size={35} />
      </button>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddCommentButton;