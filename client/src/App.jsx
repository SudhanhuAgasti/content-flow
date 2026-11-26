import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';
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
        <ThemeProvider>
          <AuthProvider>
            <BookmarkProvider>
              <AppRoutes />
              {/* Interactive 3D Yellow Transparent Bubble Cursor for Desktop & Touch Screens */}
              <BubbleCursorFollower />
              {/* Concept 03: Minimal Futuristic Network Pulse Screen */}
              <NetworkPulseOverlay />
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'bg-obsidian-900 text-obsidian-100 border border-obsidian-750 shadow-lg',
                }}
              />
            </BookmarkProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
