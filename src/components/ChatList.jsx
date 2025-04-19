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
import Chat from "./Chat";

const uid = "1";

export default function ChatList() {
  const { user } = useUser();
  const [selectedId, setSelectedId] = useState("");
  const [convoList, setConvoList] = useState([]);

  console.log("user in chatlist", user);
  const handleConversationClick = (id) => {
    setSelectedId(id); // For UI highlighting, optional
    console.log("i got clicked, my id is", selectedId);
  };

  // Fetch and update messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", uid),
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
  }, []);

  return (
    <>
      <div className="convo-container">
        <ul className="convo-log">
          {convoList.map((convo, i) => (
            <li key={i}>
              <button
                key={convo.id}
                onClick={() => handleConversationClick(convo.id)}
              >
                {console.log(convo.data)}
                <strong>{convo.data.participants[1]}:</strong>{" "}
                {convo.data.lastMessage}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="message-container">
        selected id = {selectedId}
        <Chat id={selectedId} />
      </div>
    </>
  );
}
