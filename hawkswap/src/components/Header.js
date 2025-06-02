import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "../Header.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email.endsWith("@lehigh.edu")) {
        setUser(currentUser);
      } else if (currentUser) {
        signOut(auth).then(() => {
          setUser(null);
          navigate("/error");
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email.endsWith("@lehigh.edu")) {
        setUser(user);
      } else {
        await signOut(auth);
        setUser(null);
        navigate("/error");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      navigate("/error");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="header">
      {/* Logo on the left */}
      <Link to="/marketplace" className="header-left">
        <img src="/images/Logo.png" alt="Hawk Swap Logo" className="logo-img" />
      </Link>

      {/* Centered Navigation */}
      <nav className="nav">
        <ul>
          <li><Link to="/about">About Us</Link></li>
          {user && <li><Link to="/listitem">List Item</Link></li>}
          {user && <li><Link to="/saved">Saved Listings</Link></li>}
        </ul>
      </nav>

      {/* Right-side profile or login */}
      <div className="header-right">
        {user ? (
          <button className="profile-button" onClick={handleProfileClick}>
            <img src={user.photoURL} alt="Profile" className="google-profile-pic" />
          </button>
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
