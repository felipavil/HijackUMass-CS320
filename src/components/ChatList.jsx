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
} from "firebase/firestore";
import { useUser } from "../context/UserContext";
import Chat from "./Chat";
import ChatDemo from "./ChatDemo";

export default function ChatList() {
  const { user } = useUser();
  const [selectedId, setSelectedId] = useState("");
  const [convoList, setConvoList] = useState([]);
  const [participants, setParticipants] = useState("");

  const uid = useRef("");

  console.log("user in chatlist", user);
  const handleConversationClick = (id, currParticipants) => {
    setSelectedId(id);
    setParticipants(currParticipants);
    console.log("i got clicked, my id is", selectedId);
  };

  // Fetch and update messages in real-time
  useEffect(() => {
    if (!user) return;
    uid.current = user.id === "114322947813948236908" ? "1" : "3";
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", uid.current),
      orderBy("lastUpdated", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConvoList(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex-container chat-list-container">
      <div className="convo-container flex-container-column">
        {convoList.map((convo) => (
          <button
            key={convo.id}
            onClick={() =>
              handleConversationClick(convo.id, convo.data.participants)
            }
          >
            <ChatDemo id={convo.id} />
          </button>
        ))}
      </div>
      <div className="message-container">
        {!selectedId ? (
          ""
        ) : (
          <Chat id={selectedId} participants={participants} />
        )}
      </div>
    </div>
  );
}
