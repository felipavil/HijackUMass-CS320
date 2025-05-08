import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const { token, user } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [post, setPost] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recipient, setRecipient] = useState('');
  const [confirmData, setConfirmData] = useState(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fetchPostAndRecipient = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const matched = data.find((p) => p.post_id === parseInt(postId));
      if (!matched) return navigate('/');
      setPost(matched);

      const other = matched.email === user.email
        ? await findRecipientFromMessages(postId, token, user.email)
        : matched.email;
      setRecipient(other);
    } catch (err) {
      console.error('Error fetching post or recipient:', err);
    }
  };

  const findRecipientFromMessages = async (postId, token, senderEmail) => {
    try {
      const res = await fetch(`http://localhost:4000/api/messages/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.find(m => m.sender_email !== senderEmail)?.sender_email || '';
    } catch {
      return '';
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/messages/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const fetchReviewAndConfirm = async () => {
    try {
      const confirmRes = await fetch(`http://localhost:4000/api/confirm/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const confirmJson = await confirmRes.json();
      if (confirmRes.ok) setConfirmData(confirmJson);

      const reviewRes = await fetch(`http://localhost:4000/api/reviews/exists/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviewJson = await reviewRes.json();
      if (reviewRes.ok) setAlreadyReviewed(reviewJson.alreadyReviewed);
    } catch (err) {
      console.error('Failed to fetch confirm/review info:', err);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      const res = await fetch(`http://localhost:4000/api/confirm/${postId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        await fetchReviewAndConfirm();
        alert('Ride confirmed!');
      } else {
        alert(data.error || 'Failed to confirm');
      }
    } catch (err) {
      console.error('Error confirming ride:', err);
    } finally {
      setConfirming(false);
    }
  };

  const handleMatch = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/confirm/${post.post_id}/demo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert('Ride matched!');
        // Optionally update state/UI
      } else {
        alert(data.error || 'Match failed');
      }
    } catch (err) {
      console.error('Match error:', err);
      alert('Match request failed');
    }
  };

  // const rideIsPast = () => {
  //   if (!post?.ride_date) return false;
  //   const rideDate = new Date(post.ride_date);
  //   const today = new Date();
  //   return rideDate < today;
  // };
  // This was made in the case of actual app, when the ride date has passed, you can leave a review

  const showReviewButton =
    confirmData &&
    confirmData.rider_id === user.id &&
    post?.is_matched &&
    !alreadyReviewed;

  const showConfirmButton =
    confirmData &&
    post?.is_matched && // would check rideIsPast here in real app
    ((confirmData.rider_id === user.id && !confirmData.rider_confirmed) ||
     (confirmData.driver_id === user.id && !confirmData.driver_confirmed));

  useEffect(() => {
    fetchPostAndRecipient();
  }, [postId]);

  useEffect(() => {
    if (post && recipient) fetchMessages();
  }, [post, recipient]);

  useEffect(() => {
    if (post) fetchReviewAndConfirm();
  }, [post]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !recipient) return;

    try {
      await fetch(`http://localhost:4000/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          recipient_email: recipient,
          message: input,
        }),
      });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="center-item" style={{ padding: '2rem' }}>
      <h2>Chat with {post.name}</h2>
      <div className="chat-box">
        {messages.length === 0 ? (
          <p style={{ color: 'gray' }}>No messages yet.</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={msg.sender_email === user.email ? 'msg-sent' : 'msg-received'}>
              {msg.message}
            </div>
          ))
        )}
        <div ref={bottomRef}></div>
      </div>

      <input
        className="input-box"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type message..."
      />
      <button className="white-button" onClick={sendMessage}>Send</button>
      <button className="white-button" onClick={() => navigate(-1)}>Back</button>

      {/* DEMO-ONLY Match Button */}
      {user.email !== post.email && !post.is_matched && (
        <button className="white-button" onClick={handleMatch} style={{ marginTop: '1rem' }}>
          Match Ride (Demo)
        </button>
      )}

      {showConfirmButton && (
        <button className="white-button" onClick={handleConfirm} disabled={confirming} style={{ marginTop: '1rem' }}>
          {confirming ? 'Confirming...' : 'Confirm Ride Completed'}
        </button>
      )}

      {showReviewButton && (
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/review/${postId}`} className="white-button">
            Leave a Review
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
