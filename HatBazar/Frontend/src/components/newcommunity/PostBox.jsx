import React from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const PostBox = ({ post }) => {
  const { id, title, content, username, upvotes, downvotes, postedTime } = post;
  const navigate = useNavigate(); // Hook for navigation
  
  // Format the posted time to a readable format (Reddit-style)
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

  // Handle click on the "Comments" button
  const handleCommentsClick = () => {
    navigate(`/comments/${id}`); // Navigate to the CommentsPage with the post ID
  };

  return (
    <div className="bg-white rounded-md border border-gray-300 mb-4 hover:border-gray-400 transition-colors">
      <div className="p-4">
        {/* Post metadata */}
        <div className="text-xs text-gray-500 mb-2 flex items-center">
          <span>Posted by {username}</span>
          <span className="mx-1">•</span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(postedTime)}
          </span>
        </div>

        {/* Post title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

        {/* Post content */}
        <div className="text-gray-800 mb-4 bg-gray-50 p-3 rounded border border-gray-200">
          {content}
        </div>

        {/* Voting and Comments Section */}
        <div className="flex justify-between items-center text-gray-600 text-sm border-t border-gray-200 pt-2">
          {/* Voting buttons */}
          <div className="flex items-center space-x-2">
            <button className="text-purple-500 hover:text-purple-700 flex items-center">
              <ArrowUp className="h-5 w-5" />
            </button>
            <span className="font-medium text-green-600">{upvotes}</span>
            <button className="text-blue-500 hover:text-blue-700 flex items-center">
              <ArrowDown className="h-5 w-5" />
            </button>
            <span className="font-medium text-red-600">{downvotes}</span>
          </div>

          {/* Comments button */}
          <button
            onClick={handleCommentsClick} // Add click handler
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostBox;