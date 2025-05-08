import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DriverReviews() {
  const { driverId } = useParams();
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/reviews/${driverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch reviews:', err);
        setLoading(false);
      });
  }, [driverId, token]);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="center-item" style={{ padding: '2rem' }}>
      <h1>Driver Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet for this driver.</p>
      ) : (
        reviews.map((rev, idx) => (
          <div key={idx} className="post-card" style={{ margin: '1rem 0' }}>
            <p><strong>Rating:</strong> {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}</p>
            {rev.comment && <p><strong>Comment:</strong> {rev.comment}</p>}
            <p><em>By {rev.reviewer_name} on {new Date(rev.created_at).toLocaleDateString()}</em></p>
          </div>
        ))
      )}
    </div>
  );
}

export default DriverReviews;