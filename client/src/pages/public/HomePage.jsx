import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService.js';
import { categoryService } from '../../services/categoryService.js';
import { ContentCard } from '../../components/cards/ContentCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { formatDate, calculateReadingTime } from '../../utils/formatters.js';
import {
  Compass,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Layers,
  Clock,
  Zap,
} from 'lucide-react';

export const HomePage = () => {
  const [heroArticle, setHeroArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [contentRes, catRes] = await Promise.all([
          contentService.getPublicContent({
            page: 1,
            limit: 7,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          }),
          categoryService.getPublicCategories(),
        ]);

        if (contentRes.success) {
          const items = contentRes.data.contents || [];
          if (items.length > 0) {
            setHeroArticle(items[0]);
            setRecentArticles(items.slice(1));
          } else {
            setHeroArticle(null);
            setRecentArticles([]);
          }
        }

        if (catRes.success) {
          setCategories(catRes.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load homepage content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [selectedCategory]);

  return (
    <div className="space-y-20 pb-20">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-12 border-b border-obsidian-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-900 border border-emperor-500/30 text-emperor-400 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5 text-emperor-500" />
              <span>Full-Stack Architecture & Editorial Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Curated Insights for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emperor-400 via-emperor-500 to-amber-200 bg-clip-text text-transparent">
                Modern Software Builders
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-obsidian-300 leading-relaxed max-w-2xl">
              Exploring distributed systems, cloud architecture, and modern full-stack development through production-tested engineering deep dives.
            </p>
          </div>

          {/* Featured Top Story Showcase */}
          {loading ? (
            <div className="rounded-3xl bg-obsidian-900 border border-obsidian-800 p-8 space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : heroArticle ? (
            <div className="relative rounded-3xl bg-obsidian-900 border border-obsidian-800 hover:border-emperor-500/40 transition-all duration-300 overflow-hidden shadow-surface-card group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Hero Image */}
                <div className="lg:col-span-7 relative overflow-hidden bg-obsidian-950 aspect-[16/10] lg:aspect-auto">
                  <Link to={`/content/${heroArticle.slug}`}>
                    <img
                      src={heroArticle.image?.url}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="absolute top-6 left-6">
                    <Badge variant="category">
                      {heroArticle.category?.name || 'Featured Story'}
                    </Badge>
                  </div>
                </div>

                {/* Hero Text */}
                <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-obsidian-400 font-mono mb-4">
                      <span>{formatDate(heroArticle.publishedAt || heroArticle.createdAt)}</span>
                      <span>&bull;</span>
                      <span className="text-jade-400 font-medium">
                        {calculateReadingTime(heroArticle.content || heroArticle.description)}
                      </span>
                    </div>

                    <Link to={`/content/${heroArticle.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emperor-400 transition-colors leading-tight">
                        {heroArticle.title}
                      </h2>
                    </Link>

                    <p className="mt-4 text-sm sm:text-base text-obsidian-300 leading-relaxed line-clamp-4">
                      {heroArticle.description}
                    </p>
                  </div>

                  <div className="pt-8 mt-8 border-t border-obsidian-800 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-mono text-obsidian-400">
                      Editorial Highlight
                    </span>

                    <Link to={`/content/${heroArticle.slug}`}>
                      <Button variant="primary" icon={ArrowRight}>
                        Read Story
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No Articles Published Yet"
              description="The administrator has not published any articles yet. Log in to the Admin Dashboard to author and publish content."
              actionLabel="Go to Admin Dashboard"
              onAction={() => window.location.assign('/admin/login')}
            />
          )}
        </div>
      </section>

      {/* Category Filter Pills & Recent Articles */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-obsidian-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emperor-400 mb-1 font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Taxonomy</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Latest Published Stories
            </h2>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emperor-500 text-obsidian-950 shadow-emperor-sm'
                  : 'bg-obsidian-900 border border-obsidian-750 text-obsidian-300 hover:text-white hover:bg-obsidian-850'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-emperor-500 text-obsidian-950 shadow-emperor-sm'
                    : 'bg-obsidian-900 border border-obsidian-750 text-obsidian-300 hover:text-white hover:bg-obsidian-850'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4 p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : recentArticles.length === 0 && !heroArticle ? null : recentArticles.length === 0 ? (
          <div className="text-center py-12 bg-obsidian-900/50 border border-obsidian-800 rounded-3xl p-8">
            <p className="text-sm text-obsidian-400">
              Only 1 article published currently (featured in the hero section above).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <ContentCard key={article._id} content={article} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link to="/content">
            <Button variant="secondary" size="lg" icon={ArrowRight}>
              Browse Complete Article Archive
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

