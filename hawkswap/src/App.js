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
import SavedListings from './components/SavedListings';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import './App.css';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  const categoryHandler = (e) => {
    setCategoryFilter(e.target.value);
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
      <AppContent 
        inputText={inputText} 
        inputHandler={inputHandler}
        categoryFilter={categoryFilter}
        categoryHandler={categoryHandler}
        user={user} 
        loading={loading} 
        setUser={setUser} 
      />
    </Router>
  );
};

const AppContent = ({ 
  inputText, 
  inputHandler, 
  categoryFilter,
  categoryHandler,
  user, 
  setUser, 
  loading 
}) => {
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

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
                  <div className="search-filter-container">
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      label="Search"
                      onChange={inputHandler}
                      className="search-field"
                    />
                    <FormControl className="category-filter">
                      <InputLabel id="category-filter-label">Category</InputLabel>
                      <Select
                        labelId="category-filter-label"
                        id="category-filter"
                        value={categoryFilter}
                        label="Category"
                        onChange={categoryHandler}
                      >
                        <MenuItem value="All">All Categories</MenuItem>
                        <MenuItem value="Books">Books</MenuItem>
                        <MenuItem value="Clothing">Clothing</MenuItem>
                        <MenuItem value="Furniture">Furniture</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <PhotoGrid user={user} filter={inputText} categoryFilter={categoryFilter} />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/listitem" element={<ListItem user={user} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<SavedListings />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
