import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/contentService.js';
import { toast } from 'sonner';

/**
 * ArticleReactions
 * Medium-style multi-clap interaction + dynamic emoji reaction bar.
 * - Multi-clap: Readers can tap up to 50 times (like Medium).
 * - Reaction buttons: Fire (🔥), Mindblown/Insight (💡), Rocket (🚀), Love (❤️).
 * - Micro-interactions: Floating counter bubbles & scale bounce animations.
 * - Persists to MongoDB backend via /api/public/content/:slug/react.
 */
export const ArticleReactions = ({ slug, initialClaps = 0, initialReactions = {} }) => {
  const [claps, setClaps] = useState(initialClaps);
  const [reactions, setReactions] = useState({
    fire: initialReactions?.fire || 0,
    insight: initialReactions?.insight || 0,
    rocket: initialReactions?.rocket || 0,
    heart: initialReactions?.heart || 0,
  });

  const [userClapCount, setUserClapCount] = useState(0);
  const [showClapBubble, setShowClapBubble] = useState(false);
  const [clapAnim, setClapAnim] = useState(false);

  useEffect(() => {
    setClaps(initialClaps);
    setReactions({
      fire: initialReactions?.fire || 0,
      insight: initialReactions?.insight || 0,
      rocket: initialReactions?.rocket || 0,
      heart: initialReactions?.heart || 0,
    });
  }, [initialClaps, initialReactions]);

  // Handle Medium-Style Multi-Clap
  const handleClap = async () => {
    if (userClapCount >= 50) {
      toast.info('You reached the maximum 50 claps for this article!');
      return;
    }

    // Optimistic UI update
    setClaps((prev) => prev + 1);
    setUserClapCount((prev) => prev + 1);
    setClapAnim(true);
    setShowClapBubble(true);
    setTimeout(() => setClapAnim(false), 200);

    try {
      await contentService.reactToContent(slug, 'clap', 1);
    } catch {
      // Revert if API failed
      setClaps((prev) => Math.max(0, prev - 1));
      setUserClapCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Handle Emoji Reaction
  const handleReaction = async (reactionType) => {
    // Optimistic UI update
    setReactions((prev) => ({
      ...prev,
      [reactionType]: (prev[reactionType] || 0) + 1,
    }));

    try {
      await contentService.reactToContent(slug, reactionType, 1);
    } catch {
      setReactions((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, (prev[reactionType] || 1) - 1),
      }));
    }
  };

  const reactionConfigs = [
    { type: 'fire', emoji: '🔥', label: 'Fire' },
    { type: 'insight', emoji: '💡', label: 'Insight' },
    { type: 'rocket', emoji: '🚀', label: 'Rocket' },
    { type: 'heart', emoji: '❤️', label: 'Love' },
  ];

  return (
    <div className="py-6 border-y border-obsidian-800/80 my-8 flex flex-wrap items-center justify-between gap-6">
      {/* 1. Medium Multi-Clap Button */}
      <div className="relative flex items-center gap-3">
        {/* Floating Bubble Badge on Clap */}
        {showClapBubble && (
          <div className="absolute -top-10 left-3 px-2 py-0.5 rounded-full bg-emperor-500 text-obsidian-950 font-black text-xs font-mono shadow-emperor-sm animate-bounce pointer-events-none">
            +{userClapCount}
          </div>
        )}

        <button
          type="button"
          onClick={handleClap}
          className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-obsidian-900 border border-obsidian-750 hover:border-emperor-500/50 shadow-surface-card transition-all duration-200 cursor-pointer active:scale-95 ${
            clapAnim ? 'scale-110 border-emperor-500 shadow-emperor-glow' : ''
          }`}
          title="Clap for this article (up to 50 times)"
        >
          <span className="text-xl group-hover:scale-125 transition-transform select-none">
            👏
          </span>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-sm font-black text-white group-hover:text-emperor-400 font-mono transition-colors">
              {claps.toLocaleString()}
            </span>
            <span className="text-[10px] text-obsidian-400 font-mono uppercase tracking-wider">
              {userClapCount > 0 ? `${userClapCount} by you` : 'Claps'}
            </span>
          </div>
        </button>
      </div>

      {/* 2. Emoji Reactions Palette */}
      <div className="flex items-center gap-2 sm:gap-3">
        {reactionConfigs.map((r) => {
          const count = reactions[r.type] || 0;
          return (
            <button
              key={r.type}
              type="button"
              onClick={() => handleReaction(r.type)}
              title={`React with ${r.label}`}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-800 hover:border-emperor-500/40 text-xs font-mono text-obsidian-300 hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
            >
              <span className="text-base group-hover:scale-125 transition-transform select-none">
                {r.emoji}
              </span>
              <span className="font-bold">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
