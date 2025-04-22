import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import ChatList from '../components/ChatList';
import { useUser } from '../context/UserContext';

export default function PlayGround() {
    const {user} = useUser();
    console.log("your user", user)
  return (
    <div className="center-item">

        <ChatList/>
    </div>
  );
}
