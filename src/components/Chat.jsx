import { useEffect, useState } from "react";
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
} from "firebase/firestore";
import { useUser } from "../context/UserContext";

export default function Chat({ id }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch and update messages in real-time
  console.log("your id", id);

  useEffect(() => {

    // const messagesRef = collection(db, "conversations");
    // const q = query(messagesRef, orderBy("lastUpdated", "desc"));
    if (!id) return;
    const q = query(
      collection(db, "conversations", id, "messages"),
      orderBy("createdAt", "asc")
    );
    console.log("your messages", messages);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    // async function fetchData() {
    //   console.log("hello");

    //   const snapshot = await getDocs(q);
    //   snapshot.forEach((doc) => {
    //     console.log("doc id", doc.id, doc.data());
    //   });
    // }
    // fetchData();

    return () => unsubscribe();
  }, [id]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    await addDoc(
      collection(db, "conversations", id, "messages"),
      {
        senderID: "1",
        createdAt: serverTimestamp(),
        text: message
      }
    );

    setMessage("");
  };

  return (
    <div className="chat-container">
      <ul className="chat-log">
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.senderID}:</strong> {msg.text}
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
