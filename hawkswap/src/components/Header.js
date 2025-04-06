import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase"; // Import Firebase auth and provider
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"; // Import sign-in and sign-out methods
import "../App.css";

const Header = () => {
  const [user, setUser] = useState(null); // State to store the signed-in user's information
  const navigate = useNavigate(); // Hook to navigate between pages

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email.endsWith("@lehigh.edu")) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Trigger Google sign-in popup
      const user = result.user; // Get the signed-in user's information

      // Verify the email domain
      if (user.email.endsWith("@lehigh.edu")) {
        setUser(user); // Store the user info in state
      } else {
        // If the email is not from @lehigh.edu, sign out the user and navigate to the error page
        await signOut(auth);
        setUser(null);
        navigate("/error"); // Redirect to the error page
      }
    } catch (error) {
      console.error("Error signing in with Google:", error); // Handle errors
      navigate("/error"); // Redirect to the error page on error
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
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
        {user ? (
          <div 
            className="profile-button"
            onClick={handleProfileClick}
            title="View Profile"
          >
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="google-profile-pic"
            />
          </div>
        ) : (
          <button className="google-signin-button" onClick={handleGoogleSignIn}>
            <img src="/images/google-logo.png" alt="Google Logo" className="google-logo" />
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;