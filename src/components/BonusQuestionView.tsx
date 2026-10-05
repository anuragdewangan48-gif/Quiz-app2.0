import React, { useState } from 'react';
import { ASSETS } from '../assets/assetMap';
import { sounds } from '../utils/sound';
import { BONUS_THOUGHT_TAGS } from '../data/defaultQuestions';
import { Heart, Sparkles, Send } from 'lucide-react';

interface BonusQuestionViewProps {
  creatorName: string;
  playerName: string;
  onSubmitBonus: (bonusThoughts: string, bonusTags: string[]) => void;
  onSkip: () => void;
}

export const BonusQuestionView: React.FC<BonusQuestionViewProps> = ({
  creatorName,
  playerName,
  onSubmitBonus,
  onSkip,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');

  const toggleTag = (tag: string) => {
    sounds.playPop();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sounds.playFanfare();
    onSubmitBonus(customText.trim(), selectedTags);
  };

  const handleSkip = () => {
    sounds.playPop();
    onSkip();
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between py-2 sm:py-4 px-1 max-w-sm mx-auto">
      {/* Top Floating Cute Character */}
      <div className="w-24 h-24 -mb-5 relative z-10 animate-gentle-bounce">
        <img
          src={ASSETS.pandaCrown}
          alt="Bonus Question"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-full drop-shadow-lg"
        />
        <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 absolute -top-1 -right-1 animate-pulse" />
      </div>

      {/* Main Sticky Note Notebook Card */}
      <div className="w-full relative bg-notebook-lines rounded-3xl p-5 pt-8 pb-6 shadow-[0_18px_40px_-10px_rgba(2,132,199,0.22)] border-2 border-white mb-3">
        {/* Pink Washi Tape across top-center */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 washi-tape-pink shadow-xs -rotate-1" />

        {/* Binder Holes */}
        <div className="absolute left-2.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-sky-50 border border-slate-300" />
          ))}
        </div>

        {/* Header */}
        <div className="pl-4 pr-1 text-left mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black uppercase tracking-wider mb-2">
            <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            <span>Bonus Question (Optional)</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-800 leading-tight">
            What are your honest thoughts about{' '}
            <span className="text-pink-500 capitalize">{creatorName}</span>?
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Pick quick tags or leave a personal note for {creatorName}!
          </p>
        </div>

        {/* Quick Reaction Tags */}
        <div className="pl-4 pr-1 mb-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Vibes (Tap to select):
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {BONUS_THOUGHT_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs scale-102'
                      : 'bg-white text-slate-700 border-sky-100 hover:border-pink-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Text Area */}
        <div className="pl-4 pr-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
            Write a personal message for {creatorName}:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            placeholder={`Say whatever is on your mind, ${playerName}... (e.g. favorite memory, advice, or roasts!)`}
            className="w-full p-2.5 bg-sky-50/60 rounded-2xl border border-sky-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white resize-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 px-1">
        <button
          onClick={() => handleSubmit()}
          className="w-full h-13 rounded-2xl btn-3d-blue text-white font-display text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
          <span>Save &amp; See My Verdict ➔</span>
        </button>

        <button
          onClick={handleSkip}
          className="w-full h-10 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          Skip to Results ➜
        </button>
      </div>
    </div>
  );
};
