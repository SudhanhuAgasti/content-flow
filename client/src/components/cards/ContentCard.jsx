import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, calculateReadingTime } from '../../utils/formatters.js';
import { Badge } from '../common/Badge.jsx';
import { Clock, ArrowUpRight, Calendar } from 'lucide-react';

export const ContentCard = ({ content, layout = 'vertical', index = 0 }) => {
  if (!content) return null;

  const readingTime = calculateReadingTime(content.content || content.description);
  const animationDelayMs = (index % 8) * 90; // Staggered rising cascade effect

  if (layout === 'horizontal') {
    return (
      <article className="group bg-obsidian-900 border border-obsidian-800 rounded-3xl overflow-hidden hover:border-emperor-500/40 transition-all duration-300 shadow-surface-card flex flex-col md:flex-row">
        {/* Cover Image */}
        <div className="md:w-5/12 relative overflow-hidden bg-obsidian-950 shrink-0">
          <Link to={`/content/${content.slug}`}>
            <img
              src={content.image?.url}
              alt={content.title}
              loading="lazy"
              className="w-full h-56 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-4 left-4">
            <Badge variant="category">
              {content.category?.name || 'Editorial'}
            </Badge>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-4 text-xs text-obsidian-400 font-mono mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-obsidian-500" />
                {formatDate(content.publishedAt || content.createdAt)}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-jade-400">
                <Clock className="w-3.5 h-3.5" />
                {readingTime}
              </span>
            </div>

            <Link to={`/content/${content.slug}`}>
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-emperor-400 transition-colors line-clamp-2 leading-snug">
                {content.title}
              </h3>
            </Link>

            <p className="mt-3 text-sm text-obsidian-300 line-clamp-3 leading-relaxed">
              {content.description}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-obsidian-800/80 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-obsidian-500">
              In {content.category?.name || 'General'}
            </span>

            <Link
              to={`/content/${content.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emperor-400 group-hover:text-emperor-300 group-hover:translate-x-1 transition-all"
            >
              <span>Read Full Article</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Standard Vertical Card (Real 3D Stacked Deck of Cards with Fan-Out Micro-Interactions)
  return (
    <div
      style={{ animationDelay: `${animationDelayMs}ms` }}
      className="deck-card-wrapper animate-card-rise pt-2 pb-4"
    >
      {/* Real Stack Layer 2 (Bottom card) */}
      <div className="deck-layer-2" />

      {/* Real Stack Layer 1 (Middle card) */}
      <div className="deck-layer-1" />

      {/* Real Main Top Card */}
      <article className="group relative z-10 bg-obsidian-900 border border-obsidian-750 hover:border-emperor-500/70 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-[0_12px_30px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.06)_inset] hover:shadow-[0_20px_50px_rgba(245,184,0,0.18)]">
        {/* Top Gold Glowing Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emperor-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

        <div>
          {/* Cover Image Container */}
          <div className="relative overflow-hidden aspect-[16/10] bg-obsidian-950">
            <Link to={`/content/${content.slug}`} className="block w-full h-full">
              <img
                src={content.image?.url}
                alt={content.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </Link>
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="category" className="shadow-lg backdrop-blur-md text-[10px] py-0.5 px-2.5">
                {content.category?.name || 'Editorial'}
              </Badge>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2.5 text-[11px] text-obsidian-400 font-mono mb-2.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-obsidian-500" />
                {formatDate(content.publishedAt || content.createdAt)}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-jade-400 font-medium">
                <Clock className="w-3 h-3" />
                {readingTime}
              </span>
            </div>

            <Link to={`/content/${content.slug}`} className="block group-hover:text-emperor-400 transition-colors">
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-emperor-400 transition-colors">
                {content.title}
              </h3>
            </Link>

            <p className="mt-2 text-xs text-obsidian-300 line-clamp-2 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-4 sm:px-5 pb-4 pt-2.5 flex items-center justify-between border-t border-obsidian-800/80 mt-auto text-xs bg-obsidian-950/40">
          <Link
            to={`/category/${content.category?.slug}`}
            className="text-[10px] font-mono text-obsidian-400 hover:text-emperor-400 transition-colors truncate max-w-[120px]"
          >
            #{content.category?.slug || 'content'}
          </Link>

          <Link
            to={`/content/${content.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emperor-400 group-hover:text-emperor-300 transition-colors"
          >
            <span>Read Story</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </article>
    </div>
  );
};

