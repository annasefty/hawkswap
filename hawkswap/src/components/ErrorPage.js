import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="error-page">
      <h1>Access Denied</h1>
      <p>This website is restricted to users with @lehigh.edu email addresses only.</p>
      <button className="back-button" onClick={handleBack}>
        Back to Sign In
      </button>
    </div>
  );
};

export default ErrorPage;