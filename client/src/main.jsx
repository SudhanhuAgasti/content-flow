import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Default / fallback Google Client ID or from Vite env (VITE_GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1029384756-dummy-client-id.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
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

