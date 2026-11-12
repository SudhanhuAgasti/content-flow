import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button.jsx';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-obsidian-900 border border-obsidian-750 text-emperor-500 font-mono font-black text-3xl shadow-emperor-sm">
        404
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-obsidian-400 leading-relaxed">
          The requested URL path does not exist on this server or the article may have been moved or removed.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Homepage
          </Button>
        </Link>
        <Link to="/content">
          <Button variant="secondary" icon={Compass}>
            Browse Articles
          </Button>
        </Link>
      </div>
    </div>
  );
};

