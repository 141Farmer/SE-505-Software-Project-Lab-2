import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ForumPost from '../../components/communities/Post';
import SearchBar from '../../components/communities/SearchBar';
import CreatePostButton from '../../components/communities/CreatePostButton';
import Modal from '../../components/communities/Modal';

function Forum() {
  const [posts, setPosts] = useState([]); // Start with an empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  // Fetch posts from API when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/getpost/');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data); // Update state with fetched posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.post_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.post_content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-green-100 min-h-screen">
      <Navbar />
      <h1 className="text-4xl font-bold text-center text-green-800 mb-6">Community Forum</h1>
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        className="my-4"
      />

      <div className="grid grid-cols-1 gap-6 mt-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <ForumPost 
              key={post.id} // Use a unique key (e.g., post.id if available)
              post={{
                title: post.post_title,
                content: post.post_content,
                username: post.user_name,
                upvotes: post.upvote_count,
                downvotes: post.downvote_count,
                postedTime: post.posted_time
              }}
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No posts found.</p>
        )}
      </div>

      <CreatePostButton onClick={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Write your post content..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows={5}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => console.log("Post Created")} // Implement API call later
            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-green-500 focus:ring-opacity-50"
          >
            Create Post
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Forum;