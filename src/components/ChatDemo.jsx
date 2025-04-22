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
  doc,
} from "firebase/firestore";
import { useUser } from "../context/UserContext";
import Chat from "./ChatWindow";

function formatRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000); // in seconds
  
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);
    const weeks = Math.floor(diff / (86400 * 7));
    const years = Math.floor(diff / (86400 * 365));
  
    if (diff < 60) return `${diff}s`;
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    if (weeks < 52) return `${weeks}w`;
    return `${years}y`;
  }
  
export default function ChatDemo({ id }) {
  const { user } = useUser();
  const uid = useRef("");

  const [lastUpdated, setLastUpdated] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [lastSender, setLastSender] = useState("");
  var participants = useRef([]);

  // Fetch and update messages in real-time
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "conversations", id);
    uid.current = user.id === "114322947813948236908" ? "1" : "3";
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setLastUpdated(
          data.lastUpdated?.toDate()
        );
        setLastMessage(data.lastMessage);
        setLastSender(data.lastSender);
        participants.current = data.participants;
      }
    });

    return () => unsubscribe();
  }, [lastUpdated, user]);

  return (
    <>
      {/* {console.log("current participants", participants.current)}
            {console.log("current uid", uid.current)} */}
      <strong>
        {participants.current[participants.current[0] === uid.current ? 1 : 0]}:
      </strong>{" "}
      {uid.current === lastSender ? "You: " : ""}
      {lastMessage.slice(0, 25)}
      {" ~ "}
      {formatRelativeTime(lastUpdated)}
    </>
  );
}
