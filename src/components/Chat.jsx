import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useUser } from "../context/UserContext";

export default function Chat({ id }) {
  const { user } = useUser();
  const senderID = useRef("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  // const [lastUpdated, setLastUpdated] = useState("something");

  // Fetch and update messages in real-time
  console.log("your id", id);

  useEffect(() => {
    if (!id || !user) return;
    
    senderID.current = user.id === "114322947813948236908" ? "1" : "3";

    const q = query(
      collection(db, "conversations", id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [id, user]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    await addDoc(collection(db, "conversations", id, "messages"), {
      senderID: senderID.current,
      createdAt: serverTimestamp(),
      text: message,
    });

    await updateDoc(doc(db, "conversations", id), {
      lastUpdated: serverTimestamp(),
      lastMessage: message,
      lastSender: senderID.current,
    })

    setMessage("");
  };

  return (
    <div className="chat-container">
      <ul className="chat-log">
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.senderID}:</strong> {msg.text} {"   "} {msg.createdAt?.toDate().toLocaleString()}
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
