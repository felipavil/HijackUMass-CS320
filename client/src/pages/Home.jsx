import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';

function Home() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [role, setRole] = useState('all');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState('');

  const fetchPosts = async () => {
    const params = new URLSearchParams({
      from, to, date, seats
    });
    params.append('is_matched', 'false');
    if (role !== 'all') {
      params.append('role', role);
    }

    try {
      const res = await fetch(`http://localhost:4000/api/posts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  return (
    <div className="center-item">
      <h1>Available Rides</h1>

      <FilterBar
        from={from} to={to} date={date} seats={seats}
        setFrom={setFrom} setTo={setTo} setDate={setDate} setSeats={setSeats}
        onApply={fetchPosts}
      />

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.post_id} post={post} onDelete={(id) => setPosts(posts.filter(p => p.post_id !== id))} />
        ))
      )}
    </div>
  );
}

export default Home;
