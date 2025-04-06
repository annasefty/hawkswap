import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import About from './components/About';
import ListItem from './components/ListItem';
import ErrorPage from './components/ErrorPage';
import Profile from './components/Profile';
import ListingDetail from './components/ListingDetail';
import TextField from '@mui/material/TextField';
import './App.css';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <AppContent inputText={inputText} inputHandler={inputHandler} user={user} loading={loading} setUser={setUser} />
    </Router>
  );
};

const AppContent = ({ inputText, inputHandler, user, setUser, loading }) => {
  const location = useLocation();

  if (loading) return <div>Loading...</div>; // Don't render anything until auth status is known

  return (
    <div className="App">
      {location.pathname !== '/error' && <Header user={user} setUser={setUser} />}
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="wrap">
                  <div className="search">
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      label="Search"
                      onChange={inputHandler}
                    />
                  </div>
                </div>
                <PhotoGrid user={user} filter={inputText} />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/listitem" element={<ListItem user={user} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
