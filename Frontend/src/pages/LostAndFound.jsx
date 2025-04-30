import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext.jsx';
import Toast from '../components/common/Toast';
import LostFoundCard from '../components/lostAndFound/LostFoundCard';
import LostFoundFilter from '../components/lostAndFound/LostFoundFilter';

function LostAndFound() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const socket = useContext(SocketContext);

  useEffect(() => {
    // Mock fetch posts
    // Axios.get('/api/lost-found').then(res => setPosts(res.data));
    setPosts([
      { _id: '1', itemName: 'Wallet', status: 'lost', image: '/assets/placeholder.jpg', location: 'Library', date: '2025-04-28', isClaimed: false },
      { _id: '2', itemName: 'Phone', status: 'found', image: '/assets/placeholder.jpg', location: 'Cafeteria', date: '2025-04-27', isClaimed: true, claimant: { name: 'John Doe', rollNo: 'A123' } },
    ]);
    setFilteredPosts(posts);

    // Listen for new posts
    socket.on('newLostFoundPost', (post) => {
      setToastMessage(`New ${post.status} item: ${post.itemName}`);
      setShowToast(true);
      setPosts((prev) => [...prev, post]);
      setFilteredPosts((prev) => [...prev, post]);
    });

    return () => socket.off('newLostFoundPost');
  }, [socket]);

  const handleFilter = (filters) => {
    let updatedPosts = [...posts];
    if (filters.status) {
      updatedPosts = updatedPosts.filter((post) => post.status === filters.status);
    }
    if (filters.search) {
      updatedPosts = updatedPosts.filter((post) =>
        post.itemName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.sort === 'recent') {
      updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setFilteredPosts(updatedPosts);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lost & Found Board</h1>
      {showToast && (
        <Toast message={toastMessage} type="info" onClose={() => setShowToast(false)} />
      )}
      <LostFoundFilter onFilter={handleFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredPosts.map((post) => (
          <LostFoundCard key={post._id} post={post} />
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No posts found.</p>
      )}
    </div>
  );
}

export default LostAndFound;