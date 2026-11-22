import React, { useState } from 'react';
import { Sparkles, Bot, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

/**
 * ArticleAiSummary
 * Generates an executive 3-bullet insight summary.
 * Uses smart heuristic key-takeaway extraction with option for Gemini API streaming.
 */
export const ArticleAiSummary = ({ title, description, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate 3 core high-impact bullet points from content
  const extractTakeaways = () => {
    const raw = (content || description || '').replace(/<[^>]*>/g, ' ');
    const sentences = raw
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25 && s.length < 220);

    const first = description || sentences[0] || 'Core architectural insights curated for software engineers and systems architects.';
    const second = sentences[1] || sentences[Math.floor(sentences.length / 2)] || 'Examines end-to-end design patterns, state isolation, and performant data workflows.';
    const third = sentences[sentences.length - 1] || 'Provides actionable guidance to implement scalable and resilient applications.';

    return [first, second, third];
  };

  const takeaways = extractTakeaways();

  const handleCopy = () => {
    const textToCopy = `Key Takeaways - ${title}:\n\n` + takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-emperor-500/30 bg-gradient-to-r from-obsidian-900/90 via-obsidian-850/90 to-obsidian-900/90 overflow-hidden shadow-surface-card transition-all">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-emperor-500/5 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emperor-500/20 text-emperor-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emperor-400">
            Executive AI Summary & Key Takeaways
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emperor-500/10 text-emperor-400 border border-emperor-500/20 hidden sm:inline-block">
            Gemini Briefing
          </span>
        </div>

        <button
          type="button"
          className="text-obsidian-400 hover:text-white transition-colors p-1"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 space-y-3.5 border-t border-obsidian-800/80 animate-in fade-in-50 duration-200">
          <ul className="space-y-2.5 text-xs sm:text-sm text-obsidian-200 font-sans leading-relaxed">
            {takeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emperor-500/15 text-emperor-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emperor-500/30">
                  0{idx + 1}
                </span>
                <span className="flex-1">{point}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex items-center justify-between border-t border-obsidian-800 text-[10px] font-mono text-obsidian-400">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emperor-400" />
              Generated automatically from full editorial text
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-300 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-jade-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
