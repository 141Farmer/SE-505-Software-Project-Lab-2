import React, { useState, useRef, useEffect } from 'react';

function ForumPost({ post }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isTruncated, setIsTruncated] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Check if the content exceeds 5 lines
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight, 10);
      const maxHeight = lineHeight * 5; // 5 lines
      setIsTruncated(contentRef.current.scrollHeight > maxHeight);
    }
  }, [post.content]);

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(upvoteCount - 1);
      setIsUpvoted(false);
    } else if (!isUpvoted && isDownvoted) {
      setUpvoteCount(upvoteCount + 1);
      setIsUpvoted(true);
      setDownvoteCount(downvoteCount - 1);
      setIsDownvoted(false);
    } else {
      setUpvoteCount(upvoteCount + 1);
      setIsUpvoted(true);
    }
  };

  const handleDownvote = () => {
    if (isDownvoted) {
      setDownvoteCount(downvoteCount - 1);
      setIsDownvoted(false);
    } else if (isUpvoted && !isDownvoted) {
      setDownvoteCount(downvoteCount + 1);
      setIsDownvoted(true);
      setUpvoteCount(upvoteCount - 1);
      setIsUpvoted(false);
    } else {
      setDownvoteCount(downvoteCount + 1);
      setIsDownvoted(true);
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md transition-all duration-300 hover:shadow-lg max-w-4xl mx-auto">
      {/* User and Date Info */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-green-600 font-medium">Posted by {post.user}</span>
        <span className="text-gray-400">{post.date}</span>
      </div>

      <h2 className="text-2xl font-semibold text-black mb-2">{post.title}</h2>

      {/* Post Content */}
      <div className="text-black mb-4">
        <div
          ref={contentRef}
          className={`${!showFullContent ? 'line-clamp-5' : ''}`}
        >
          {post.content}
        </div>
        {isTruncated && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-black-500 font-semibold mt-2"
          >
            {showFullContent ? 'See Less' : 'See More'}
          </button>
        )}
      </div>

      {/* Voting Buttons */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={handleUpvote}
          className={`font-semibold ${
            isUpvoted ? 'text-green-500' : 'text-green-800'
          }`}
        >
          {isUpvoted ? '★ Upvoted' : '☆ Upvote'} ({upvoteCount})
        </button>

        <button
          onClick={handleDownvote}
          className={`font-semibold ${
            isDownvoted ? 'text-red-400' : 'text-red-600'
          }`}
        >
          {isDownvoted ? '★ Downvoted' : '☆ Downvote'} ({downvoteCount})
        </button>

        <button onClick={toggleComments} className="text-cyan-600 font-semibold">
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2 text-black">Comments</h3>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-2 border rounded mb-2 bg-gray-100">
                {comment}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}

          {/* Add Comment */}
          <div className="flex mt-4 space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="border p-2 flex-grow rounded"
            />
            <button
              onClick={handleAddComment}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition-all duration-300"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForumPost;