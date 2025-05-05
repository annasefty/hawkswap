import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "../Header.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <Link to="/marketplace" className="header-left">
        <img src="/images/Logo2.png" alt="Hawk Swap Logo" className="logo-img" />
      </Link>

      <h1 className="header-title">HAWK SWAP MARKETPLACE</h1>

      <div className="hamburger mobile-only" onClick={toggleMenu}>
        {menuOpen ? (
          <span className="close-icon">&times;</span>
        ) : (
          <>
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </>
        )}
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          {user && <li><Link to="/listitem" onClick={toggleMenu}>List an Item</Link></li>}
          {user && <li><Link to="/saved" onClick={toggleMenu}>Saved Listings</Link></li>}
          {user ? (
            <li onClick={handleProfileClick}>
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="google-profile-pic"
              />
            </li>
          ) : (
            <li>
              <button className="google-signin-button" onClick={handleGoogleSignIn}>
                <img src="/images/google-logo.png" alt="Google Logo" className="google-logo" />
                Sign in with Google
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="header-right desktop-only">
        <nav className="nav">
          <ul>
            <li><Link to="/about">About</Link></li>
            {user && <li><Link to="/listitem">List an Item</Link></li>}
            {user && <li><Link to="/saved">Saved Listings</Link></li>}
          </ul>
        </nav>
        {user ? (
          <div className="profile-button" onClick={handleProfileClick} title="View Profile">
            <img src={user.photoURL} alt={user.displayName} className="google-profile-pic" />
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
