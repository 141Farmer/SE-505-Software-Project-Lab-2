import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the post ID
import AddCommentButton from './AddCommentButton';


const CommentsPage = () => {
  const { id } = useParams(); // Get the post ID from the route parameter
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch the post and its comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch the post
        const postResponse = await fetch(`http://127.0.0.1:8000/getpost/${id}`);
        const postData = await postResponse.json();
        setPost(postData);
          
        // Fetch the comments for the post
        const commentsResponse = await fetch(`http://127.0.0.1:8000/getcomment/${id}/`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
        
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="p-4 ">
      {/* Display the post */}
      <div className="bg-white rounded-md border border-gray-300 p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.post_title}</h2>
        <p className="text-gray-800">{post.content}</p>
        <div className="text-xs text-gray-500 mt-2">
          Posted by {post.user_name} • {new Date(post.posted_time).toLocaleString()}
        </div>
      </div>

      {/* Display the comments */}
      <div className="bg-white rounded-md border border-gray-300 p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="text-sm text-gray-800">{comment.comment_text}</div>
              <div className="text-xs text-gray-500 mt-1">
                Commented by {comment.user_name} • {new Date(comment.commented_time).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
     <AddCommentButton postId={id}/>
    </div>
  );
};

export default CommentsPage;