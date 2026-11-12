import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right" 
      theme="dark"
      toastOptions={{
        style: {
          background: '#11141A',
          color: '#F1F4F9',
          border: '1px solid #2A303F',
        },
      }}
    />
  </React.StrictMode>
);

