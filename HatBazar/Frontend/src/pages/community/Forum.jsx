import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ForumPost from '../../components/Community/Post';
import SearchBar from '../../components/Community/SearchBar';
import CreatePostButton from '../../components/community/CreatePostButton';
import Modal from '../../components/Community/Modal';

function Forum() {
  const [posts, setPosts] = useState([
    { 
      id: 2, 
      user: 'kibria',
      date: '11/01/2025',
      title: 'How to Prevent Pests Naturally?', 
      content: 'Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...',
      comments: ['Neem oil works wonders!', 'Try companion planting for pest control.']
    },
    { 
      id: 3, 
      user: 'abcd34',
      date: '11/01/2025',
      title: 'How to plant farm?', 
      content: 'Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...',
      comments: ['Neem oil works wonders!', 'Try companion planting for pest control.']
    },
    { 
      id: 4, 
      user: 'mastermind',
      date: '11/01/2025',
      title: 'how to invest optimally?', 
      content: 'Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...Looking for effective methods to prevent pests without chemicals...',
      comments: []
    },
    
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post = {
        id: posts.length + 1,
        user: 'currentUser', //  auth system
        date: new Date().toLocaleDateString(),
        title: newPost.title,
        content: newPost.content,
        comments: []
      };
      
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
      setIsModalOpen(false);
    }
  };

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
            <ForumPost key={post.id} post={post} />
          ))
        ) : (
          <p className="text-center text-white">No posts found.</p>
        )}
      </div>

      <CreatePostButton onClick={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="space-y-2">
            <textarea
              placeholder="Write your post content..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={5}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleCreatePost}
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