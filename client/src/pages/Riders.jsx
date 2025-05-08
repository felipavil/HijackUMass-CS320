import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';

function Riders() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState('');

  const fetchPosts = async () => {
    const params = new URLSearchParams({
      role: 'rider',
      from,
      to,
      date,
      seats
    });
    params.append('is_matched', 'false');
    try {
      const res = await fetch(`http://localhost:4000/api/posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching rider posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  return (
    <div className="center-item" style={{ padding: '2rem' }}>
      <h1>Rider Ride Posts</h1>
      <p className="small-font" style={{ maxWidth: '600px', textAlign: 'center' }}>
        These are rides offered by UMass students who are driving and have open seats. Reach out and catch a ride!
      </p>

      <div className="flex-container" style={{ margin: '1rem 0' }}>
        <Link to="/drivers" className="white-button">Switch to Drivers</Link>
        <Link to="/create" className="white-button">Create a Post</Link>
      </div>

      <FilterBar
        from={from} to={to} date={date} seats={seats}
        setFrom={setFrom} setTo={setTo} setDate={setDate} setSeats={setSeats}
        onApply={fetchPosts}
      />

      {posts.length === 0 ? (
        <p>No rider posts found.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.post_id} post={post} onDelete={(id) => setPosts(posts.filter(p => p.post_id !== id))} />
        ))
      )}
    </div>
  );
}

export default Riders;
