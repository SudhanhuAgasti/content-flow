import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService } from '../../services/contentService.js';
import { ContentCard } from '../../components/cards/ContentCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ArrowLeft, FolderTree, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export const CategoryPage = () => {
  const { categorySlug } = useParams();

  const [category, setCategory] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchCategoryContent = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await contentService.getPublicContent({
          category: categorySlug,
          page: currentPage,
          limit: 9,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });

        if (res.success) {
          setContents(res.data.contents || []);
          if (res.meta?.pagination) {
            setPagination(res.meta.pagination);
          }
          if (res.data.contents && res.data.contents.length > 0) {
            setCategory(res.data.contents[0].category);
          }
        }
      } catch (err) {
        toast.error('Failed to load category articles: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [categorySlug, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div>
        <Link
          to="/content"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-obsidian-400 hover:text-white transition-colors font-mono mb-4"
        >
          <ArrowLeft className="w-4 h-4 text-emperor-500" />
          <span>All Categories</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-center text-emperor-500 shadow-sm">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white capitalize tracking-tight">
              {category?.name || categorySlug.replace(/-/g, ' ')}
            </h1>
            <p className="text-xs text-obsidian-400 font-mono mt-1">
              /{categorySlug} &bull; {pagination.totalCount} Published Article(s)
            </p>
          </div>
        </div>
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
          title="No Published Stories in this Category"
          description="There are currently no published articles filed under this category. Check back soon or explore other topics."
          actionLabel="View All Articles"
          onAction={() => window.location.assign('/content')}
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
            Page {pagination.currentPage} of {pagination.totalPages}
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
