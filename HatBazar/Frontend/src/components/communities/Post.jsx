import React, { useState } from 'react';

function ForumPost({ post }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes || 0);
  const [downvoteCount, setDownvoteCount] = useState(post.downvotes || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleVote = async (voteType) => {
    try {
      if(!post.id){
        console.log("post id not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/votepost/${post.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote: voteType,
          currentUser: 'current_user_id', // Replace with the actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      const data = await response.json();
      console.log(data.message);

      // Update local state based on the vote type
      if (voteType === 1) {
        if (isUpvoted) {
          setUpvoteCount(upvoteCount - 1);
          setIsUpvoted(false);
        } else {
          setUpvoteCount(upvoteCount + 1);
          setIsUpvoted(true);
          if (isDownvoted) {
            setDownvoteCount(downvoteCount - 1);
            setIsDownvoted(false);
          }
        }
      } else if (voteType === -1) {
        if (isDownvoted) {
          setDownvoteCount(downvoteCount - 1);
          setIsDownvoted(false);
        } else {
          setDownvoteCount(downvoteCount + 1);
          setIsDownvoted(true);
          if (isUpvoted) {
            setUpvoteCount(upvoteCount - 1);
            setIsUpvoted(false);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  const handleUpvote = () => {
    handleVote(1); // 1 represents an upvote
  };

  const handleDownvote = () => {
    handleVote(-1); // -1 represents a downvote
  };

  const toggleComments = async () => {
    setShowComments(!showComments);

    if (!showComments) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/getcomment/${post_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch comments');

        const data = await response.json();
        setComments(data);
        console.log(response);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { user_name: 'You', comment_text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* User and Date Info */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-violet-400 font-medium">Posted by {post.username}</span>
        <span className="text-gray-400">{post.postedTime}</span>
      </div>

      <h2 className="text-2xl font-semibold text-black mb-2">{post.title}</h2>
      <p className="text-black mb-4">{post.content}</p>

      {/* Voting Buttons */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={handleUpvote}
          className={`font-semibold ${
            isUpvoted ? 'text-violet-400' : 'text-violet-600'
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
          <h3 className="text-lg font-bold mb-2 text-white">Comments</h3>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-2 border rounded mb-2 bg-gray-100">
                <p className="font-semibold">{comment.user_name}:</p>
                <p>{comment.comment_text}</p>
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