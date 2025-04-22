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

function isWithin15Mins(nextTime, currTime) {
  if (!currTime) {
    console.log("is false");
    return false;
  }
  if (!nextTime) {
    return true;
  }
  const t1 = currTime.toDate();
  const t2 = nextTime.toDate();

  const diffInMs = Math.abs(t1 - t2); // time difference in milliseconds
  const diffInMinutes = diffInMs / (1000 * 60); // convert to minutes

  if (diffInMinutes <= 15) {
    return true;
  }

  return false;
}

export default function ChatDisplay({ id }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const uid = useRef("");
  const endRef = useRef(null);

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

  // Scroll to the end of message window to show the latest message
  useEffect(() => {
    const scrollParent = endRef.current?.parentElement;
    if (endRef.current && scrollParent) {
      scrollParent.scrollTop = scrollParent.scrollHeight;
    }
  }, [messages]);
  

  return (
    <div className="chat-wrapper">
      <div className="chat-scroll-window">
        {messages.map((msg, index) => (
          <div className="flex-container-column chat-container ">
            <div>
              {isWithin15Mins(
                msg.createdAt,
                index > 0 ? messages[index - 1].createdAt : null
              )
                ? ""
                : msg.createdAt?.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
            </div>
            <div
              className={
                msg.senderID === uid.current ? "user-chat" : "partner-chat"
              }
            >
              <div className="sub-chat">
                {msg.text}
                <br />
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
    </div>
  );
}
