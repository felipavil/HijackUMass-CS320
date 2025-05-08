import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

function ReviewPage() {
  const { token } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user already submitted a review
    fetch(`http://localhost:4000/api/reviews/exists/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAlreadyReviewed(data.alreadyReviewed))
      .catch((err) => {
        console.error('Failed to check review status:', err);
        setError('Error checking review status');
      });
  }, [postId, token]);

  const handleSubmit = async () => {
    if (stars < 1 || stars > 5) {
      alert('Please select a star rating from 1 to 5.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id: postId, stars, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Review submitted!');
        navigate('/');
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit review');
    }
  };

  return (
    <div className="center-item" style={{ padding: '2rem' }}>
      <h1>Leave a Review</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {alreadyReviewed ? (
        <p>You’ve already submitted a review for this ride.</p>
      ) : (
        <div className="post-card" style={{ marginTop: '1rem', padding: '2rem' }}>
          <p><strong>Select Star Rating:</strong></p>
          <div style={{ fontSize: '1.5rem' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                style={{
                  cursor: 'pointer',
                  color: n <= stars ? 'gold' : 'gray',
                }}
                onClick={() => setStars(n)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Optional comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input-box"
            style={{ marginTop: '1rem', height: '100px' }}
          />

          <button className="red-button" onClick={handleSubmit} style={{ marginTop: '1rem' }}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewPage;