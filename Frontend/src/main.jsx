import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Make sure we import App here
import './index.css'; // Keep this if you have global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);