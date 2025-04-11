import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./nav-bar.css";
import { useUser } from "../../context/UserContext";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="nav-bar">
      <nav className="nav-container">
        <div className="flex-container">
          <div>
            <Link className="link" to="/">
              <img
                className="logo-img"
                src="https://www.colorhexa.com/881c1c.png"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="home">
            <Link className="link" to="/">
              <span className="title ">HijackUMass</span>
            </Link>
          </div>
          <div
            className="menu-icon align-right"
            onClick={() => {
              console.log("im clicked");
              console.log("your menu", menuOpen);
              setMenuOpen(!menuOpen);
            }}
          >
            &#9776; {/* Hamburger icon */}
          </div>
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <div className="inner-nav">
            <Link className="link" to="/need-a-ride">
              Need A Ride
            </Link>{" "}
            &emsp;
            <Link className="link" to="/have-a-ride">
              Have A Ride
            </Link>{" "}
            &emsp;
            <Link className="link" to="/make-a-post">
              Make A Post
            </Link>{" "}
          </div>
        </div>
        {user === null ? (
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <div className="inner ">
              <Link className="link white-button large-button" to="/log-in">
                Log In
              </Link>{" "}
              &emsp;
              <Link className="link white-button" to="/sign-up">
                Sign Up
              </Link>{" "}
            </div>
          </div>
        ) : (
          <>
            <div className={`nav-links ${menuOpen ? "active" : ""}`}>
              <div className="inner ">
                <Link className="link white-button" to="/profile">
                  Hello {user.displayName}
                </Link>{" "}
                &emsp;
                <Link
                  className="link white-button"
                  to="http://localhost:3000/logout"
                >
                  Log Out
                </Link>{" "}
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
