import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { authService } from './services/authService.js';

const RootApp = () => {
  const [googleClientId, setGoogleClientId] = useState('');

  useEffect(() => {
    // Fetch Google Client ID strictly from backend server config
    authService
      .getGoogleClientId()
      .then((res) => {
        if (res.clientId) {
          setGoogleClientId(res.clientId);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'contentflow-auth.apps.googleusercontent.com'}>
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
    </GoogleOAuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);

