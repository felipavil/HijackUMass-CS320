import { useEffect, useState, useRef} from "react";
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

  const uid = useRef("");

  console.log("user in chatlist", user);
  const handleConversationClick = (id) => {
    setSelectedId(id); // For UI highlighting, optional
    console.log("i got clicked, my id is", selectedId);
  };

  // Fetch and update messages in real-time
  useEffect(() => {
    if(!user) return;
    uid.current= user.id === "114322947813948236908" ? "1" : "3"
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

    // async function fetchData() {
    //   console.log("hello");

    //   const snapshot = await getDocs(q);
    //   snapshot.forEach((doc) => {
    //     console.log("doc id", doc.id, doc.data());
    //   });
    // }
    // fetchData();

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <div className="convo-container flex-container-column">
          {convoList.map((convo) => (
              <button
                key={convo.id}
                onClick={() => handleConversationClick(convo.id)}
              >
                <ChatDemo id={convo.id}/>
              </button>
          ))}
      </div>
      <div className="message-container">
        selected id = {selectedId}
        <Chat id={selectedId} />
      </div>
    </>
  );
}
