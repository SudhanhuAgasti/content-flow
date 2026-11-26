import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const BookmarkContext = createContext(null);

const STORAGE_KEY = 'contentflow_bookmarks_v1';

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse bookmarks from storage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to persist bookmarks to storage', e);
    }
  }, [bookmarks]);

  const isBookmarked = (idOrSlug) => {
    if (!idOrSlug) return false;
    return bookmarks.some(
      (b) => b._id === idOrSlug || b.id === idOrSlug || b.slug === idOrSlug
    );
  };

  const toggleBookmark = (article) => {
    if (!article) return;
    const identifier = article._id || article.id || article.slug;
    const exists = isBookmarked(identifier);

    if (exists) {
      setBookmarks((prev) =>
        prev.filter((b) => (b._id || b.id || b.slug) !== identifier)
      );
      toast.info('Removed from bookmarks', {
        description: article.title ? `"${article.title.slice(0, 40)}..."` : 'Article removed',
      });
    } else {
      // Store minimal snapshot so the saved page works instantly offline/cached
      const snapshot = {
        _id: article._id || article.id,
        id: article.id || article._id,
        slug: article.slug,
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt || article.createdAt || new Date().toISOString(),
        category: article.category
          ? {
              name: article.category.name || 'Editorial',
              slug: article.category.slug || 'editorial',
            }
          : { name: 'Editorial', slug: 'editorial' },
        image: article.image ? { url: article.image.url } : null,
        bookmarkedAt: new Date().toISOString(),
      };

      setBookmarks((prev) => [snapshot, ...prev]);
      toast.success('Saved to bookmarks!', {
        description: `You can access "${article.title?.slice(0, 35)}..." anytime in your Saved collection.`,
      });
    }
  };

  const removeBookmark = (idOrSlug) => {
    setBookmarks((prev) =>
      prev.filter((b) => (b._id || b.id || b.slug) !== idOrSlug)
    );
    toast.info('Article removed from bookmarks');
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
    toast.info('All bookmarks cleared');
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        bookmarkCount: bookmarks.length,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        clearAllBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
