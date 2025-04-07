const VoteHandler = async (postId, voteType) => {
          try {
            const token = localStorage.getItem('token'); // Get the token for authorization
            const response = await fetch(`http://127.0.0.1:8000/votepost/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the token in the request
              },
              body: JSON.stringify({ post_id: postId, voteValue: voteType }), // Send the vote type (upvote or downvote)
            });
        
            if (response.ok) {
              const data = await response.json(); // Get the updated vote count from the response
              return data; // Return the updated vote count
            } else {
              console.error('Failed to submit vote');
              return null; // Return null if the request fails
            }
          } catch (error) {
            console.error('Error submitting vote:', error);
            return null; // Return null if an error occurs
          }
        };
        
        export default VoteHandler; // Export as default