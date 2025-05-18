import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Added .jsx extension here

// We're NOT importing CSS files statically here
// They will be loaded dynamically in the correct order by ThemeButtonDemo component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);