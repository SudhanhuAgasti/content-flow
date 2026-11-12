import React from 'react';
import { Sparkles, ShieldCheck, Flame, BookOpen } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col justify-between selection:bg-emperor-500 selection:text-obsidian-950">
      {/* Top Brand Bar */}
      <header className="border-b border-obsidian-700/60 bg-obsidian-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emperor-500 to-emperor-700 flex items-center justify-center shadow-emperor-sm text-obsidian-950 font-extrabold text-xl font-mono">
              CF
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Content<span className="text-emperor-500">Flow</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-jade-950 border border-jade-600/40 text-jade-400">
                Phase 1 Active
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-obsidian-400 font-mono">
              Emperor &bull; Obsidian &bull; Jade
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-850 border border-emperor-500/30 text-emperor-400 text-sm font-medium w-fit mb-6">
          <Sparkles className="w-4 h-4 text-emperor-500 animate-pulse" />
          <span>Production Architecture Initialized</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Next-Generation <br />
          <span className="bg-gradient-to-r from-emperor-400 via-emperor-500 to-amber-200 bg-clip-text text-transparent">
            MERN Content Management
          </span>
        </h1>

        <p className="mt-6 text-lg text-obsidian-300 max-w-2xl leading-relaxed">
          Clean architecture, decoupled public editorial web portal and administrative control center, 
          powered by MongoDB, Express, React, and Node.js.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-700/60 hover:border-emperor-500/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-obsidian-800 border border-emperor-500/20 flex items-center justify-center text-emperor-400 mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emperor-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Secure Admin CMS</h3>
            <p className="text-sm text-obsidian-400 leading-relaxed">
              HTTP-only JWT cookies, bcrypt password hashing, and role-guarded management dashboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-700/60 hover:border-jade-500/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-obsidian-800 border border-jade-500/20 flex items-center justify-center text-jade-400 mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-jade-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dynamic Editorial Portal</h3>
            <p className="text-sm text-obsidian-400 leading-relaxed">
              Instant reader access to published content, category filters, fast search, and pagination.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-700/60 hover:border-emperor-500/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-obsidian-800 border border-emperor-500/20 flex items-center justify-center text-emperor-400 mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-emperor-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bespoke Aesthetics</h3>
            <p className="text-sm text-obsidian-400 leading-relaxed">
              Curated Emperor Yellow, deep obsidian black, and emerald jade status indicators.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-obsidian-700/60 bg-obsidian-900/60 px-6 py-6 text-center text-xs text-obsidian-400 font-mono">
        ContentFlow &copy; 2026 &bull; Architecture Phase 1 Complete &bull; Enterprise MERN Platform
      </footer>
    </div>
  );
}

