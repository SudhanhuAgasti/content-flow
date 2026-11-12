import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contentService } from '../../services/contentService.js';
import { categoryService } from '../../services/categoryService.js';
import { ContentCard } from '../../components/cards/ContentCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const ContentListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page'), 10) || 1
  );
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounce search by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory) params.category = selectedCategory;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, currentPage, setSearchParams]);

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getPublicCategories();
        if (res.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch Published Content
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        category: selectedCategory || undefined,
        sortBy: 'createdAt',
        sortOrder,
      };

      const res = await contentService.getPublicContent(params);
      if (res.success) {
        setContents(res.data.contents || []);
        if (res.meta?.pagination) {
          setPagination(res.meta.pagination);
        }
      }
    } catch (error) {
      toast.error('Failed to retrieve articles: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedCategory, sortOrder]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-900 border border-emperor-500/30 text-emperor-400 text-xs font-semibold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emperor-500" />
          <span>Full Public Archive</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          All Published Articles
        </h1>
        <p className="text-sm text-obsidian-400 leading-relaxed">
          Filter by technical domain, search by topic keyword, and browse our complete collection of published insights.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-surface-card">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search by keyword, topic, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-850 border border-obsidian-750 text-white placeholder-obsidian-500 text-sm focus:outline-none focus:border-emperor-500 transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl bg-obsidian-850 border border-obsidian-750 text-white text-xs font-medium focus:outline-none focus:border-emperor-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat.publishedCount})
              </option>
            ))}
          </select>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-obsidian-750 text-obsidian-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emperor-500" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Category Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            selectedCategory === ''
              ? 'bg-emperor-500 text-obsidian-950 shadow-emperor-sm'
              : 'bg-obsidian-900 border border-obsidian-800 text-obsidian-400 hover:text-white hover:bg-obsidian-850'
          }`}
        >
          All Topics ({pagination.totalCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.slug);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat.slug
                ? 'bg-emperor-500 text-obsidian-950 shadow-emperor-sm'
                : 'bg-obsidian-900 border border-obsidian-800 text-obsidian-400 hover:text-white hover:bg-obsidian-850'
            }`}
          >
            {cat.name} ({cat.publishedCount})
          </button>
        ))}
      </div>

      {/* Articles Grid */}
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
      ) : contents.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Published Articles Found"
          description="We couldn't find any articles matching your search query. Try removing filters or searching for another term."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((article) => (
            <ContentCard key={article._id} content={article} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="pt-8 border-t border-obsidian-800 flex items-center justify-between">
          <span className="text-xs text-obsidian-400 font-mono">
            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
          </span>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
