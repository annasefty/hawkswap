import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router, Route, and Routes
import Header from './components/Header';
import Search from './components/Search';
import PhotoGrid from './components/PhotoGrid';
import About from './components/About'; // Import About component

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<div><Search /><PhotoGrid /></div>} />
          <Route path="/about" element={<About />} /> {/* Add route for About page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
