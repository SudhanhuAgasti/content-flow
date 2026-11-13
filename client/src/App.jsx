import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
import { NetworkPulseOverlay } from './components/common/NetworkPulseOverlay.jsx';
import { BubbleCursorFollower } from './components/common/BubbleCursorFollower.jsx';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <AppRoutes />
          {/* Interactive 3D Yellow Transparent Bubble Cursor for Desktop & Touch Screens */}
          <BubbleCursorFollower />
          {/* Concept 03: Minimal Futuristic Network Pulse Screen */}
          <NetworkPulseOverlay />
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#11141A',
                color: '#F1F4F9',
                border: '1px solid #2A303F',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
