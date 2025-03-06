import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PostBox from '../../components/newcommunity/PostBox';
import SearchBar from '../../components/newcommunity/SearchBar';
import AddPostButton from '../../components/newcommunity/AddPostButton';


function PostBrowsePage() {
  const [posts, setPosts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/getpost/');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on title, content, or username
  const filteredPosts = posts.filter((post) =>
    post.post_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.post_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-green-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-6">
          Community Forum
        </h1>

        {/* Search Bar */}
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="my-4 w-full max-w-8xl px-8"
        />
      </div>

      {/* Container for centering content */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostBox
                key={post.posted_id}
                post={{
                  id: post.post_id,
                  title: post.post_title,
                  content: post.post_content,
                  username: post.user_name,
                  upvotes: post.upvote_count,
                  downvotes: post.downvote_count,
                  postedTime: post.posted_time,
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No posts found.</p>
          )}
        </div>
      </div>
      <AddPostButton/>


    </div>
  );
}

export default PostBrowsePage;
