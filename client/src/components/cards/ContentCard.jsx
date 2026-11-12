import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, calculateReadingTime } from '../../utils/formatters.js';
import { Badge } from '../common/Badge.jsx';
import { Clock, ArrowUpRight, Calendar } from 'lucide-react';

export const ContentCard = ({ content, layout = 'vertical' }) => {
  if (!content) return null;

  const readingTime = calculateReadingTime(content.content || content.description);

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

  // Standard Vertical Card
  return (
    <article className="group bg-obsidian-900 border border-obsidian-800 rounded-3xl overflow-hidden hover:border-emperor-500/40 transition-all duration-300 shadow-surface-card flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        <div className="relative overflow-hidden aspect-[16/10] bg-obsidian-950">
          <Link to={`/content/${content.slug}`}>
            <img
              src={content.image?.url}
              alt={content.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-3.5 left-3.5">
            <Badge variant="category">
              {content.category?.name || 'Editorial'}
            </Badge>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-obsidian-400 font-mono mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-obsidian-500" />
              {formatDate(content.publishedAt || content.createdAt)}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-jade-400">
              <Clock className="w-3.5 h-3.5" />
              {readingTime}
            </span>
          </div>

          <Link to={`/content/${content.slug}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-emperor-400 transition-colors line-clamp-2 leading-snug">
              {content.title}
            </h3>
          </Link>

          <p className="mt-2.5 text-xs text-obsidian-300 line-clamp-2 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-obsidian-800/60 mt-auto">
        <Link
          to={`/category/${content.category?.slug}`}
          className="text-[11px] font-mono text-obsidian-400 hover:text-white transition-colors"
        >
          #{content.category?.slug || 'content'}
        </Link>

        <Link
          to={`/content/${content.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-emperor-400 group-hover:text-emperor-300 transition-colors"
        >
          <span>Read Story</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
