import React, { useState, useEffect, useCallback } from 'react';
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
  Search,
  ShieldCheck,
  Database,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export const HomePage = () => {
  const [heroArticle, setHeroArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Fetch Homepage Data
  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);

      const [contentRes, catRes] = await Promise.all([
        contentService.getPublicContent({
          page: 1,
          limit: 9,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
        categoryService.getPublicCategories(),
      ]);

      if (contentRes.success) {
        const items = contentRes.data.contents || [];
        if (items.length > 0) {
          setHeroArticle(items[0]);
          // Include ALL published articles in the catalog so none are hidden or missing
          setRecentArticles(items);
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
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscriberEmail || !subscriberEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to ContentFlow Editorial briefings!');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
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

            <div className="mt-8 flex items-center gap-4">
              <a href="#articles">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Stories
                </Button>
              </a>
              <a href="#about">
                <Button variant="secondary" size="lg">
                  Learn About System
                </Button>
              </a>
            </div>
          </div>

          {/* Featured Top Story Showcase */}
          {loading ? (
            <div className="rounded-3xl bg-obsidian-900 border border-obsidian-800 p-8 space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : heroArticle ? (
            <div className="relative rounded-2xl bg-obsidian-900/90 border border-obsidian-800 hover:border-emperor-500/50 transition-all duration-300 overflow-hidden shadow-surface-card hover:shadow-[0_15px_40px_rgba(245,184,0,0.08)] group backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Hero Image (Optimized Compact Aspect) */}
                <div className="lg:col-span-6 relative overflow-hidden bg-obsidian-950 aspect-[16/9] lg:aspect-auto">
                  <Link to={`/content/${heroArticle.slug}`} className="block w-full h-full">
                    <img
                      src={heroArticle.image?.url}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                  </Link>
                  <div className="absolute top-4 left-4">
                    <Badge variant="category" className="shadow-md">
                      {heroArticle.category?.name || 'Featured Story'}
                    </Badge>
                  </div>
                </div>

                {/* Hero Text (Streamlined Padding) */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 text-xs text-obsidian-400 font-mono mb-3">
                      <span>{formatDate(heroArticle.publishedAt || heroArticle.createdAt)}</span>
                      <span>&bull;</span>
                      <span className="text-jade-400 font-medium">
                        {calculateReadingTime(heroArticle.content || heroArticle.description)}
                      </span>
                    </div>

                    <Link to={`/content/${heroArticle.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emperor-400 transition-colors leading-snug">
                        {heroArticle.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-xs sm:text-sm text-obsidian-300 leading-relaxed line-clamp-3">
                      {heroArticle.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-6 border-t border-obsidian-800/80 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-mono text-obsidian-400">
                      Top Editorial Pick
                    </span>

                    <Link to={`/content/${heroArticle.slug}`}>
                      <Button variant="primary" size="sm" icon={ArrowRight}>
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

      {/* 2. STEP-BY-STEP ARTICLE EXPLORATION SECTION */}
      <section id="articles" className="max-w-7xl mx-auto px-6 scroll-mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-obsidian-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emperor-400 mb-1 font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Step 2: Interactive Discovery</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Published Content Catalog
            </h2>
            <p className="text-sm text-obsidian-400 mt-1">
              Browse articles by domain or search by technical keyword.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-400" />
            <input
              type="text"
              placeholder="Filter stories by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-white placeholder-obsidian-500 text-xs focus:outline-none focus:border-emperor-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
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
              {cat.name} ({cat.publishedCount})
            </button>
          ))}
        </div>

        {/* Articles Grid (Modern Compact 3 to 4 Columns with Responsive Ergonomics) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                <Skeleton className="h-36 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            ))}
          </div>
        ) : recentArticles.length === 0 && !heroArticle ? (
          <EmptyState
            icon={BookOpen}
            title="No Matching Stories"
            description="No articles found matching your selected category or query. Clear your filters to browse all stories."
            actionLabel="Reset Topic Filters"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        ) : recentArticles.length === 0 ? (
          <div className="text-center py-10 bg-obsidian-900/50 border border-obsidian-800 rounded-2xl p-6">
            <p className="text-sm text-obsidian-400">
              Only 1 article published currently (featured in the hero section above).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentArticles.map((article, index) => (
              <ContentCard key={article._id} content={article} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/content">
            <Button variant="secondary" size="lg" icon={ArrowRight}>
              Open Complete Article Catalog & Pagination
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. STEP-BY-STEP ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-6 scroll-mt-28">
        <div className="p-10 md:p-14 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-10 shadow-surface-card">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-850 border border-emperor-500/30 text-emperor-400 text-xs font-semibold font-mono mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Step 3: Platform Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered for Editorial Performance & Reliability
            </h2>
            <p className="mt-3 text-base text-obsidian-300 leading-relaxed">
              ContentFlow is an enterprise-grade CMS platform designed with strict separation of concerns, 
              guaranteeing uncompromised persistence in MongoDB Atlas and real-time public synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750">
              <div className="w-10 h-10 rounded-xl bg-emperor-500/10 border border-emperor-500/20 flex items-center justify-center text-emperor-400 mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Permanent MongoDB Storage</h3>
              <p className="text-xs text-obsidian-400 leading-relaxed">
                Zero mock content. Every published article, category reference, and author record is permanently stored and indexed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750">
              <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center text-jade-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Stateless JWT Cookies</h3>
              <p className="text-xs text-obsidian-400 leading-relaxed">
                HTTP-only SameSite cookies and bcrypt password hashing guard the administrative control dashboard from unauthorized access.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Zero-Leakage Draft Isolation</h3>
              <p className="text-xs text-obsidian-400 leading-relaxed">
                Draft content is isolated at the database level and never exposed through public reader endpoints until explicitly published.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STEP-BY-STEP CONTACT & COMMUNICATIONS */}
      <section id="contact" className="max-w-7xl mx-auto px-6 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-obsidian-900 border border-obsidian-800 rounded-3xl p-10 md:p-14 shadow-surface-card">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-850 border border-emperor-500/30 text-emperor-400 text-xs font-semibold font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>Step 4: Editorial Desk</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Stay Connected with ContentFlow
            </h2>
            <p className="text-sm text-obsidian-300 leading-relaxed max-w-xl">
              Subscribe to weekly architectural roundups or reach out directly to our editorial board with article proposals.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-6 rounded-2xl bg-jade-950/60 border border-jade-600/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-jade-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Subscription Confirmed</h4>
                <p className="text-xs text-jade-300">
                  You will receive our latest architectural briefings directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-obsidian-850 border border-obsidian-750 text-white placeholder-obsidian-500 text-xs focus:outline-none focus:border-emperor-500 transition-colors"
                  />
                  <Button type="submit" variant="primary" size="md" icon={Send}>
                    Join
                  </Button>
                </div>
                <p className="text-[11px] text-obsidian-500 font-mono">
                  Zero spam &bull; Unsubscribe at any time &bull; Editorial digests only
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
