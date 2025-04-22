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
import "./chat-styles.css";
import ChatDisplay from "./ChatDisplay";


export default function ChatWindow({ id, participants }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const uid = useRef("");

  // Fetch and update messages in real-time



  useEffect(() => {
    if (!id || !user) return;
    uid.current = user.id === "114322947813948236908" ? "1" : "3";

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
      // adding the newly sent message to the messages db
      senderID: uid.current,
      createdAt: serverTimestamp(),
      text: message,
    });

    await updateDoc(doc(db, "conversations", id), {
      // update the latest info for the demo part
      lastUpdated: serverTimestamp(),
      lastMessage: message,
      lastSender: uid.current,
    });

    setMessage("");
  };

  return (
    <div className="chat-window-container">
      <div className="user-chat-bar">
        User {participants[participants[0] === uid ? 0 : 1]}
      </div>
  
      <div className="chat-wrapper">
        <ChatDisplay id={id} />
      </div>
  
      <form onSubmit={sendMessage} className="send-message flex-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-holder"
          rows={1}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
  
  
}
