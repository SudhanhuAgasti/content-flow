import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { contentService } from '../../services/contentService.js';
import { ContentCard } from '../../components/cards/ContentCard.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { formatDate, calculateReadingTime } from '../../utils/formatters.js';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const ContentDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await contentService.getPublicContentBySlug(slug);
        if (res.success && res.data?.content) {
          setContent(res.data.content);
          setRelatedContent(res.data.relatedContent || []);
        } else {
          setError('Article not found or unpublished');
        }
      } catch (err) {
        setError(err.message || 'Article could not be retrieved');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.title,
        text: content?.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="space-y-4 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-center text-rose-400 mx-auto">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">
          Article Not Accessible
        </h1>
        <p className="text-sm text-obsidian-400 leading-relaxed">
          The article you are trying to read does not exist, has been removed, or is currently unpublished in draft mode.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link to="/content">
            <Button variant="primary" icon={ArrowLeft}>
              Return to All Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(content.content);

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/content"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-obsidian-400 hover:text-white transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4 text-emperor-500" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-obsidian-400 hover:text-white transition-colors"
            title="Share Article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to={`/category/${content.category?.slug}`}>
            <Badge variant="category">
              {content.category?.name || 'General'}
            </Badge>
          </Link>
          <span className="text-obsidian-600">&bull;</span>
          <span className="text-xs text-jade-400 font-mono font-medium">
            Published Story
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.2]">
          {content.title}
        </h1>

        <p className="text-lg md:text-xl text-obsidian-300 leading-relaxed font-normal">
          {content.description}
        </p>

        {/* Editorial Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-obsidian-800 text-xs font-mono text-obsidian-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white font-medium">
              <Calendar className="w-4 h-4 text-emperor-500" />
              {formatDate(content.publishedAt || content.createdAt)}
            </span>
            <span className="flex items-center gap-2 text-jade-400">
              <Clock className="w-4 h-4" />
              {readingTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-obsidian-500">
            <span>Slug:</span>
            <span className="text-obsidian-300 font-semibold">/{content.slug}</span>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="relative rounded-3xl overflow-hidden border border-obsidian-800 shadow-surface-card bg-obsidian-950 aspect-[16/9]">
        <img
          src={content.image?.url}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Body Prose Content */}
      <div className="prose prose-invert max-w-none space-y-6 text-obsidian-200 text-base md:text-lg leading-relaxed font-normal">
        {/* Render formatted HTML or paragraph blocks */}
        {content.content.startsWith('<') ? (
          <div
            className="prose-content leading-loose"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        ) : (
          content.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))
        )}
      </div>

      {/* Article Author Footer Card */}
      <div className="p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase font-mono tracking-widest text-emperor-400 font-bold">
            ContentFlow Editorial Team
          </span>
          <h4 className="text-base font-bold text-white">
            Published via ContentFlow Master CMS
          </h4>
          <p className="text-xs text-obsidian-400 max-w-md">
            All content published through our system undergoes editorial verification and is stored securely in MongoDB.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="px-5 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 text-xs font-bold text-white transition-colors shrink-0 flex items-center gap-2"
        >
          <Share2 className="w-4 h-4 text-emperor-500" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Related Content Section */}
      {relatedContent.length > 0 && (
        <section className="pt-12 border-t border-obsidian-800 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-emperor-400 font-mono font-bold block mb-1">
              Category Archives
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              More Stories in {content.category?.name || 'this Category'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedContent.map((related) => (
              <ContentCard key={related._id} content={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

