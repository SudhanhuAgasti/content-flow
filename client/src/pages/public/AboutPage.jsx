import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button.jsx';
import {
  ShieldCheck,
  Database,
  Layers,
  ArrowRight,
  Code2,
  Cpu,
  Globe,
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      {/* Hero Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-900 border border-emperor-500/30 text-emperor-400 text-xs font-semibold font-mono">
          <Layers className="w-3.5 h-3.5 text-emperor-500" />
          <span>About ContentFlow</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Engineered for Editorial Excellence & System Integrity
        </h1>
        <p className="text-base sm:text-lg text-obsidian-300 leading-relaxed">
          ContentFlow is an enterprise-grade full-stack Content Management System architected on MongoDB, Express, React, and Node.js.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 shadow-surface-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emperor-500/10 border border-emperor-500/20 flex items-center justify-center text-emperor-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            100% MongoDB Persistence
          </h3>
          <p className="text-sm text-obsidian-400 leading-relaxed">
            Zero hardcoded article mocks. All published content, categories, and administrator credentials are persistently stored and indexed in MongoDB Atlas.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 shadow-surface-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center text-jade-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Stateless Cookie Security
          </h3>
          <p className="text-sm text-obsidian-400 leading-relaxed">
            Authentication is powered by JSON Web Tokens stored exclusively in secure, HTTP-only, SameSite cookies with salted bcrypt password hashing and rate limiting.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 shadow-surface-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Dynamic Decoupled Design
          </h3>
          <p className="text-sm text-obsidian-400 leading-relaxed">
            A strict boundary separates the public reader portal from the administrative CMS dashboard, guaranteeing drafts and unpublished work are never leaked.
          </p>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="p-10 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-8">
        <div className="border-b border-obsidian-800 pb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Production Technology Stack
          </h2>
          <p className="text-sm text-obsidian-400 mt-1">
            Built with modern, reliable, and strictly compatible libraries.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-obsidian-850 border border-obsidian-750">
            <span className="text-emperor-400 font-bold block mb-1">FRONTEND</span>
            <span className="text-white text-sm font-sans font-bold block">React 18 & Vite</span>
            <span className="text-obsidian-400 mt-1 block">Tailwind CSS + Lucide</span>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-850 border border-obsidian-750">
            <span className="text-jade-400 font-bold block mb-1">BACKEND</span>
            <span className="text-white text-sm font-sans font-bold block">Express.js</span>
            <span className="text-obsidian-400 mt-1 block">Node.js ES Modules</span>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-850 border border-obsidian-750">
            <span className="text-sky-400 font-bold block mb-1">DATABASE</span>
            <span className="text-white text-sm font-sans font-bold block">MongoDB</span>
            <span className="text-obsidian-400 mt-1 block">Mongoose ODM + Indexes</span>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-850 border border-obsidian-750">
            <span className="text-purple-400 font-bold block mb-1">STORAGE</span>
            <span className="text-white text-sm font-sans font-bold block">Cloudinary CDN</span>
            <span className="text-obsidian-400 mt-1 block">Buffer Stream Upload</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-8 border-t border-obsidian-800">
        <Link to="/content">
          <Button variant="primary" size="lg" icon={ArrowRight}>
            Explore Published Content
          </Button>
        </Link>
      </div>
    </div>
  );
};

