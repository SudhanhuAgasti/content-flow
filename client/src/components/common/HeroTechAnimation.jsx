import React from 'react';
import { Database, Server, Cpu, Globe, Layers, ShieldCheck, Terminal, Code2 } from 'lucide-react';

export const HeroTechAnimation = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 select-none pointer-events-none overflow-hidden">
      {/* Ambient Radial Jade/Emerald Light-Green Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[260px] bg-gradient-to-r from-jade-500/15 via-jade-400/20 to-emperor-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Modern 3D Isometric Architectural Grid Canvas */}
      <div className="relative border border-jade-500/20 bg-obsidian-900/60 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(16,185,129,0.08),inset_0_1px_1px_rgba(255,255,255,0.08)]">
        {/* Subtle Tech Header Ribbon */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-800 text-[11px] font-mono text-obsidian-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-jade-400 animate-pulse shadow-[0_0_10px_#34D399]" />
            <span className="text-jade-300 font-semibold tracking-wider uppercase">System Architecture Hub</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-obsidian-400">
            <span>CLUSTER: ACTIVE</span>
            <span>&bull;</span>
            <span className="text-jade-400">MERN 2026 TOPOLOGY</span>
          </div>
        </div>

        {/* 3D Flow Nodes Grid (Responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          {/* Node 1: Cloud & API Gateway */}
          <div className="group relative p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/80 hover:border-jade-400/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-400/30 flex items-center justify-center text-jade-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-jade-400/80 block">Gateway</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Distributed Edge</h4>
            <p className="text-[11px] text-obsidian-400 mt-1">Multi-Region CDN & Route Optimization</p>
          </div>

          {/* Node 2: Microservices Engine */}
          <div className="group relative p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/80 hover:border-jade-400/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-400/30 flex items-center justify-center text-jade-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Server className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-jade-400/80 block">Compute</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Node.js Engine</h4>
            <p className="text-[11px] text-obsidian-400 mt-1">Non-Blocking I/O & Microservice Mesh</p>
          </div>

          {/* Node 3: Persistent Database */}
          <div className="group relative p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/80 hover:border-jade-400/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-400/30 flex items-center justify-center text-jade-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-jade-400/80 block">Storage</span>
            <h4 className="text-sm font-bold text-white mt-0.5">MongoDB Atlas</h4>
            <p className="text-[11px] text-obsidian-400 mt-1">Sharded Documents & Realtime Pipeline</p>
          </div>

          {/* Node 4: Security Shield */}
          <div className="group relative p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/80 hover:border-jade-400/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-400/30 flex items-center justify-center text-jade-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-jade-400/80 block">Security</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Zero-Trust JWT</h4>
            <p className="text-[11px] text-obsidian-400 mt-1">HTTP-Only Cookies & OAuth Protection</p>
          </div>
        </div>

        {/* Live Connecting Neon Light Beam (Horizontal Energy Pulse) */}
        <div className="mt-6 pt-4 border-t border-obsidian-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-jade-400 shadow-[0_0_8px_#34D399]" />
            <span className="text-obsidian-300">Live Pulse:</span>
            <span className="text-jade-400 font-semibold bg-jade-950/60 border border-jade-500/30 px-2 py-0.5 rounded-md">
              99.98% Latency &lt; 28ms
            </span>
          </div>

          <div className="flex items-center gap-2 text-obsidian-400 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-emperor-400" />
            <span>Interactive Production Mesh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

