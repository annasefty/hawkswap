import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, provider } from "../firebase"; // Import Firebase auth and provider
import { signInWithPopup } from "firebase/auth"; // Import the sign-in method
import "../App.css";

const Header = () => {
  const [user, setUser] = useState(null); // State to store the signed-in user's information

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Trigger Google sign-in popup
      const user = result.user; // Get the signed-in user's information
      setUser(user); // Store the user info in state
      console.log("User signed in:", user); // Log user info for debugging
    } catch (error) {
      console.error("Error signing in with Google:", error); // Handle errors
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src="/images/Logo.png" alt="Hawk Swap Logo" className="logo-img" />
        </Link>
      </div>
      <h1 className="header-title">HAWKSWAP MARKETPLACE</h1>
      <div className="header-right">
        <nav className="nav">
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/listitem">List an Item</Link></li>
          </ul>
        </nav>
        <button className="google-signin-button" onClick={handleGoogleSignIn}>
          {user ? (
            <img
              src={user.photoURL} // Use the user's Google profile picture
              alt={user.displayName} // Use the user's display name as alt text
              className="google-profile-pic"
            />
          ) : (
            <>
              <img src="/images/google-logo.png" alt="Google Logo" className="google-logo" />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;