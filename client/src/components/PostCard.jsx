import '../styles/styles.css';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, onDelete, onEdit }) {
  const { user } = useAuth();
  const isOwner = user?.email === post.email;
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avgRating, setAvgRating] = useState(null);

  const [editData, setEditData] = useState({
    from_location: post.from_location,
    to_location: post.to_location,
    ride_date: post.ride_date,
    seats: post.seats,
  });

  useEffect(() => {
    if (post.role === 'driver') {
      fetch(`http://localhost:4000/api/reviews/avg/${post.user_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.avg_rating) {
            setAvgRating(data.avg_rating);
          }
        })
        .catch(err => console.error('Avg rating fetch error:', err));
    }
  }, [post.role, post.user_id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts/${post.post_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) onDelete(post.post_id);
      else alert(data.message || 'Delete failed');
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/posts/${post.post_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error('Failed to update post');
      const updatedPost = await res.json();

      alert('Post updated successfully');
      setIsEditing(false);
      if (onEdit) {
        onEdit(post.post_id, updatedPost);
      }
    } catch (err) {
      console.error('Edit failed:', err);
      alert('Could not update post');
    }
  };

  return (
    <motion.div
      className="post-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 className="big-font">
          {post.role === 'driver' ? '🚗 Driver' : '🙋‍♂️ Rider'}
        </h2>
        <button
          className="white-button"
          style={{ padding: '2px 10px' }}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {isEditing ? (
            <>
              <input
                className="input-box"
                name="from_location"
                placeholder="From"
                value={editData.from_location}
                onChange={handleEditChange}
              />
              <input
                className="input-box"
                name="to_location"
                placeholder="To"
                value={editData.to_location}
                onChange={handleEditChange}
              />
              <input
                className="input-box"
                name="ride_date"
                type="date"
                value={editData.ride_date}
                onChange={handleEditChange}
              />
              <input
                className="input-box"
                name="seats"
                type="number"
                min="1"
                value={editData.seats}
                onChange={handleEditChange}
              />
            </>
          ) : (
            <>
              <p className="small-font"><strong>From:</strong> {post.from_location}</p>
              <p className="small-font"><strong>To:</strong> {post.to_location}</p>
              <p className="small-font"><strong>Date:</strong> {post.ride_date}</p>
              <p className="small-font"><strong>Seats:</strong> {post.seats}</p>
              <p className="small-font">
                <strong>Posted by:</strong>{' '}
                <a href={`/driver/${post.user_id}/reviews`} style={{ color: 'blue', textDecoration: 'underline' }}>
                  {post.name} ({post.email})
                </a>
              </p>
              {avgRating && (
                <p className="small-font" style={{ marginTop: '-0.5rem' }}>
                  ⭐ {avgRating}/5 average rating
                </p>
              )}
            </>
          )}

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {isOwner && (
              <>
                <button className="white-button" onClick={handleDelete}>
                  Delete
                </button>
                {isEditing ? (
                  <>
                    <button className="white-button" onClick={handleSaveEdit}>
                      Save
                    </button>
                    <button className="white-button" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="white-button" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                )}
              </>
            )}

            {!isOwner && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="white-button"
                  onClick={() => navigate(`/chat/${post.post_id}`)}
                >
                  Chat with {post.name.split(' ')[0]}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PostCard;