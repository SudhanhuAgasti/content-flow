import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { ContentCard } from '../../components/cards/ContentCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Bookmark, ArrowLeft, Trash2, BookOpen } from 'lucide-react';

export const BookmarksPage = () => {
  const { bookmarks, bookmarkCount, clearAllBookmarks } = useBookmarks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-800/80">
        <div className="space-y-3">
          <Link
            to="/content"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-obsidian-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4 text-emperor-500" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emperor-500/10 border border-emperor-500/30 text-emperor-400">
              <Bookmark className="w-6 h-6 fill-emperor-500/20" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Saved Articles
              </h1>
              <p className="text-sm text-obsidian-400 mt-0.5">
                Your private reading library stored securely on this device.
              </p>
            </div>
          </div>
        </div>

        {/* Counter & Clear All Action */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-obsidian-300">
            <span className="text-emperor-400 font-bold">{bookmarkCount}</span>{' '}
            {bookmarkCount === 1 ? 'article saved' : 'articles saved'}
          </div>

          {bookmarkCount > 0 && (
            <button
              type="button"
              onClick={clearAllBookmarks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-crimson-950/40 hover:bg-crimson-900/60 border border-crimson-800/50 text-xs font-mono text-crimson-400 hover:text-crimson-300 transition-colors"
              title="Clear all saved articles"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks Grid / Empty State */}
      {bookmarks.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-obsidian-900/80 border border-obsidian-800 flex items-center justify-center text-obsidian-600 shadow-surface-card">
            <Bookmark className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No saved stories yet</h3>
            <p className="text-sm text-obsidian-400 leading-relaxed">
              Whenever you find an article you love, tap the bookmark icon on any card or story to save it here for later.
            </p>
          </div>

          <Link to="/content">
            <Button variant="primary" className="mt-4 gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Explore Stories</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bookmarks.map((article, idx) => (
            <ContentCard key={article._id || article.slug} content={article} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
export default BookmarksPage;
