import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import NeedARide from "./pages/NeedARide";
import HaveARide from "./pages/HaveARide";
import MakeAPost from "./pages/MakeAPost";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar/NavBar";
import FailLogin from "./pages/FailLogin";
import { useUser } from "./context/UserContext";
import PlayGround from "./pages/PlayGround";
import PostTester from "./pages/PostTester";

function App() {
  return (
    <Router>
      <UserProvider>
        {/* anything wrapped in UserProvider can access user info */}
        <AppRoutes />
      </UserProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user } = useUser();
  console.log(user);
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/need-a-ride" element={<NeedARide />} />
        <Route path="/have-a-ride" element={<HaveARide />} />
        <Route
          path="/make-a-post"
          element={user ? <MakeAPost /> : <Navigate to="/log-in" />}
        />
        {/*if the user is not logged in, redirect to log in page*/}

        <Route path="/log-in" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/fail-log-in" element={<FailLogin />} />
        <Route path="/play-ground" element={<PlayGround />} />
        <Route path="/test-posts" element={<PostTester />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
