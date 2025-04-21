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
import Chat from "./Chat";


export default function ChatDemo({id}) {
  const { user } = useUser();
  const uid = useRef("");

  const [lastUpdated, setLastUpdated] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [lastSender, setLastSender] = useState("");
  var participants = useRef([]);

  // Fetch and update messages in real-time
  useEffect(() => {
    if(!user) return;
    const docRef = doc(db, "conversations", id);
    uid.current = user.id === "114322947813948236908" ? "1" : "3";
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setLastUpdated(data.lastUpdated?.toDate().toLocaleString());
            setLastMessage(data.lastMessage);
            setLastSender(data.lastSender);
            participants.current = (data.participants);
          }
    });

    return () => unsubscribe();
  }, [lastUpdated, user]);


  return (
    <>
            {/* {console.log("current participants", participants.current)}
            {console.log("current uid", uid.current)} */}

            <strong>{participants.current[participants.current[0] === uid.current? 1 : 0]}:</strong>{" "}
            {uid.current === lastSender? "You: ": ""}
            {lastMessage}
            {"  "}
            {lastUpdated}
    </>
  );
}
