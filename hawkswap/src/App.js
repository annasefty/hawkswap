import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import About from './components/About';
import TextField from '@mui/material/TextField';
import './App.css';

const App = () => {
  const [inputText, setInputText] = useState('');

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  return (
    <Router>
      <div className="App">
        <Header />
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
