import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService.js';
import { categoryService } from '../../services/categoryService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { formatDate } from '../../utils/formatters.js';
import {
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Delete Dialog State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search query by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAdminCategories();
        if (res.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Content Records
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
        sortBy: 'createdAt',
        sortOrder,
      };

      const res = await contentService.getAdminContent(params);
      if (res.success) {
        setContents(res.data.contents || []);
        if (res.meta?.pagination) {
          setPagination(res.meta.pagination);
        }
      }
    } catch (error) {
      toast.error('Failed to retrieve content list: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedCategory, selectedStatus, sortOrder]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Handle Quick Publication Status Toggle
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await contentService.toggleStatus(id, newStatus);
      if (res.success) {
        toast.success(`Content status changed to ${newStatus}`);
        fetchContent();
      }
    } catch (error) {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  // Open Delete Confirmation
  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Execute Deletion
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      const res = await contentService.deleteContent(itemToDelete._id);
      if (res.success) {
        toast.success('Article permanently deleted from database');
        setDeleteModalOpen(false);
        setItemToDelete(null);
        fetchContent();
      }
    } catch (error) {
      toast.error('Deletion failed: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emperor-400 mb-1 font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Editorial Repository</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Content Manager
          </h1>
          <p className="mt-1 text-sm text-obsidian-400">
            Search, filter, edit, publish, and delete articles across all categories.
          </p>
        </div>

        <Link to="/admin/content/create" className="w-full sm:w-auto">
          <Button variant="primary" icon={PlusCircle} className="w-full sm:w-auto">
            Create New Article
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-surface-card">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-850 border border-obsidian-750 text-white placeholder-obsidian-500 text-sm focus:outline-none focus:border-emperor-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-obsidian-850 border border-obsidian-750 text-white text-xs font-medium focus:outline-none focus:border-emperor-500 cursor-pointer min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-obsidian-850 border border-obsidian-750 text-white text-xs font-medium focus:outline-none focus:border-emperor-500 cursor-pointer min-w-[120px]"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-obsidian-850 border border-obsidian-750 text-obsidian-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emperor-500" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Content Records Table */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl overflow-hidden shadow-surface-card">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : contents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Matching Content Found"
            description="No articles match your current search and filter criteria. Try clearing filters or create a new article."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedStatus('');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-obsidian-200">
              <thead className="bg-obsidian-850/80 text-[11px] uppercase tracking-wider text-obsidian-400 font-mono border-b border-obsidian-800">
                <tr>
                  <th className="px-6 py-4">Featured Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {contents.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-obsidian-850/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image?.url}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover border border-obsidian-750 shrink-0 bg-obsidian-950"
                        />
                        <div className="min-w-0 max-w-lg">
                          <p className="font-bold text-white text-sm group-hover:text-emperor-400 transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-obsidian-400 truncate mt-0.5">
                            {item.description}
                          </p>
                          <span className="text-[11px] text-obsidian-500 font-mono">
                            /{item.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="category">
                        {item.category?.name || 'Uncategorized'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={item.status} dot>
                        {item.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-xs text-obsidian-400 font-mono">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Publish / Unpublish Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item._id, item.status)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                            item.status === 'published'
                              ? 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                              : 'border-jade-500/40 text-jade-300 hover:bg-jade-950/40'
                          }`}
                        >
                          {item.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>

                        {/* View on Public Site (if published) */}
                        {item.status === 'published' && (
                          <a
                            href={`/content/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                            title="View Public Article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {/* Edit Button */}
                        <Link to={`/admin/content/edit/${item._id}`}>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                            title="Edit Content"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(item)}
                          className="p-1.5 rounded-lg text-obsidian-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Bar */}
        {!loading && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-obsidian-800 flex items-center justify-between bg-obsidian-850/50">
            <span className="text-xs text-obsidian-400 font-mono">
              Page {pagination.currentPage} of {pagination.totalPages} &bull; {pagination.totalCount} Total Articles
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={ChevronLeft}
                disabled={!pagination.hasPrevPage}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1 inline" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Content Record"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This will permanently remove the record from MongoDB and delete its image asset.`}
      />
    </div>
  );
};

