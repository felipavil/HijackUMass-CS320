import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// Create the context
export const UserContext = createContext();

// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

// Context provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/authenticated", { withCredentials: true })
      .then((response) => {
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      });
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};