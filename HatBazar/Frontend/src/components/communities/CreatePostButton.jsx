
import React from 'react';
import { Plus } from 'lucide-react';

const CreatePostButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 p-4 bg-green-600 hover:bg-green-700 
                 text-white rounded-full shadow-lg transition-all duration-300 
                 transform hover:scale-110 focus:outline-none focus:ring-2 
                 focus:ring-green-500 focus:ring-opacity-50"
      aria-label="Create new post"
    >
      <Plus size={35} />
    </button>
  );
};

export default CreatePostButton;