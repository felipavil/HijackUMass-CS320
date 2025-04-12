import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import Chat from '../components/Chat';
import { useUser } from '../context/UserContext';

export default function PlayGround() {
    const {user} = useUser();
    console.log("your user", user)
  return (
    <div className="center-item">

        <Chat/>
    </div>
  );
}
