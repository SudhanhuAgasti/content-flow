import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { formatDate } from '../../utils/formatters.js';
import {
  FileText,
  CheckCircle2,
  Clock,
  FolderTree,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  ExternalLink,
  Edit,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

export const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    published: 0,
    draft: 0,
    categories: 0,
  });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await contentService.getAdminContent({
        page: 1,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (res.success) {
        setMetrics(
          res.data.metrics || {
            total: 0,
            published: 0,
            draft: 0,
            categories: 0,
          }
        );
        setRecentContent(res.data.contents || []);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await contentService.toggleStatus(id, newStatus);
      if (res.success) {
        toast.success(`Article marked as ${newStatus}`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const statCards = [
    {
      label: 'Total Content',
      value: metrics.total,
      icon: FileText,
      color: 'text-emperor-400',
      bgColor: 'bg-emperor-500/10',
      borderColor: 'border-emperor-500/20',
      description: 'Total articles in database',
    },
    {
      label: 'Published Articles',
      value: metrics.published,
      icon: CheckCircle2,
      color: 'text-jade-400',
      bgColor: 'bg-jade-500/10',
      borderColor: 'border-jade-500/20',
      description: 'Active on public web portal',
    },
    {
      label: 'Draft Articles',
      value: metrics.draft,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      description: 'Under editorial revision',
    },
    {
      label: 'Active Categories',
      value: metrics.categories,
      icon: FolderTree,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
      description: 'Content classification tags',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emperor-400 mb-1 font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Administrative Command</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-obsidian-400">
            Real-time content performance, publication metrics, and editorial controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/content/create" className="w-full sm:w-auto">
            <Button variant="primary" icon={PlusCircle} className="w-full sm:w-auto">
              Create New Article
            </Button>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="secondary" icon={ExternalLink} className="w-full sm:w-auto">
              View Live Site
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl bg-obsidian-900 border ${stat.borderColor} shadow-surface-card transition-all duration-200 hover:border-obsidian-600`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-obsidian-400 font-mono">
                  {stat.label}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <span className="text-3xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-obsidian-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Content Table */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl overflow-hidden shadow-surface-card">
        <div className="p-6 border-b border-obsidian-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recently Created Content
            </h2>
            <p className="text-xs text-obsidian-400 mt-0.5">
              Latest additions to the content repository
            </p>
          </div>

          <Link
            to="/admin/content"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emperor-400 hover:text-emperor-300 transition-colors uppercase tracking-wider font-mono"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : recentContent.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Content Found"
            description="You haven't authored any articles yet. Create your first piece to publish to the web portal."
            actionLabel="Create First Article"
            onAction={() => window.location.assign('/admin/content/create')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-obsidian-200">
              <thead className="bg-obsidian-850/80 text-[11px] uppercase tracking-wider text-obsidian-400 font-mono border-b border-obsidian-800">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {recentContent.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-obsidian-850/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image?.url}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-obsidian-750 shrink-0 bg-obsidian-950"
                        />
                        <div className="min-w-0 max-w-md">
                          <p className="font-bold text-white truncate text-sm">
                            {item.title}
                          </p>
                          <p className="text-xs text-obsidian-400 truncate">
                            /{item.slug}
                          </p>
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
                        {/* Quick Status Toggle Button */}
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

                        <Link to={`/admin/content/edit/${item._id}`}>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

