import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function InboxPage() {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/messages/inbox', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error('Inbox error:', err);
      }
    };

    fetchInbox();
  }, [token]);

  return (
    <div className="center-item" style={{ padding: '2rem' }}>
      <h1>Your Conversations</h1>
      {conversations.length === 0 ? (
        <p>No conversations yet. Start chatting by clicking on a post!</p>
      ) : (
        conversations.map((conv, i) => (
          <div
            key={i}
            style={{
              border: '2px solid var(--light-red)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: 'var(--white)',
              width: '90%',
              maxWidth: '600px',
            }}
          >
            <p className="small-font"><strong>Post ID:</strong> {conv.post_id}</p>
            <p className="small-font"><strong>With:</strong> {conv.name} ({conv.email})</p>
            <p className="small-font"><strong>Last Message:</strong> {conv.last_message}</p>
            <button className="white-button" onClick={() => navigate(`/chat/${conv.post_id}`)}>
              Open Chat
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default InboxPage;
