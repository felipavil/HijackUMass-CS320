import { useUser } from "../context/UserContext";
export default function Profile() {
    const { user } = useUser();
    console.log("your user", user)

  return (
    <div className="center-item">
        
     <h1> Hello {user.displayName} </h1>
     Your info, your rides, more stuff will be here when we get to it :)
    </div>
  );
}
