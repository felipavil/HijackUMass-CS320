import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { useUser } from '../context/UserContext'; // adjust the path if needed



export default function Chat() {
  const { user } = useUser(); // your custom user context
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch and update messages in real-time
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    await addDoc(collection(db, 'messages'), {
      text: message,
      uid: user.id,
      displayName: user.displayName,
      email: user.emails[0],
      createdAt: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <div className="chat-container">
      <ul className="chat-log">
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.displayName}:</strong> {msg.text}
          </li>
        ))}
      </ul>

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
