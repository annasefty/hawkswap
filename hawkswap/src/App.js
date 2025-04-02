import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import About from './components/About';
import ListItem from './components/ListItem';
import ErrorPage from './components/ErrorPage'; // Import the ErrorPage component
import TextField from '@mui/material/TextField';
import './App.css';

const App = () => {
  const [inputText, setInputText] = useState('');

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  return (
    <Router>
      <AppContent inputText={inputText} inputHandler={inputHandler} />
    </Router>
  );
};

const AppContent = ({ inputText, inputHandler }) => {
  const location = useLocation(); // Now inside the Router context

  console.log(location.pathname); // Logs the current path

  return (
    <div className="App">
      {/* Conditionally render Header based on the current route */}
      {location.pathname !== '/error' && <Header />}
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
                <PhotoGrid filter={inputText} />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/listitem" element={<ListItem />} />
          <Route path="/error" element={<ErrorPage />} /> {/* Error page without Header */}
          <Route path="*" element={<div>Page Not Found</div>} /> {/* Fallback route */}
        </Routes>
      </div>
    </div>
  );
};

export default App;