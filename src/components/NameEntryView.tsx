import React, { useState } from 'react';
import { ASSETS } from '../assets/assetMap';
import { sounds } from '../utils/sound';

interface NameEntryViewProps {
  onContinue: (name: string) => void;
  titlePrompt?: string;
  subtitle?: string;
  initialValue?: string;
}

export const NameEntryView: React.FC<NameEntryViewProps> = ({
  onContinue,
  titlePrompt = "what's your",
  subtitle = 'name?',
  initialValue = '',
}) => {
  const [name, setName] = useState(initialValue);
  const maxLength = 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      sounds.playBonk();
      return;
    }
    sounds.playPop();
    onContinue(trimmed);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 px-1 relative">
      {/* Peeking Cute Mascot (matching Image 1 top-left) */}
      <div className="w-full max-w-sm relative -mb-7 z-10 flex items-end pl-6 pointer-events-none">
        <div className="w-24 h-24 sm:w-28 sm:h-28 -rotate-6">
          <img
            src={ASSETS.pandaMascot}
            alt="Cute Panda"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-md rounded-full"
          />
        </div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-sm relative">
        {/* Hanging Gingham Sign (matching Image 1) */}
        <div className="relative z-20 flex flex-col items-center -mb-5 pointer-events-none">
          {/* Wooden / Brown cords & Pink button pin */}
          <div className="w-6 h-6 rounded-full bg-pink-400 border-2 border-white shadow-md flex items-center justify-center z-20">
            <div className="w-2 h-2 rounded-full bg-pink-600" />
          </div>
          {/* Cords */}
          <div className="w-24 h-5 flex justify-between px-2 -mt-2">
            <div className="w-0.5 h-full bg-amber-700/60 rotate-20" />
            <div className="w-0.5 h-full bg-amber-700/60 -rotate-20" />
          </div>
          {/* Gingham Sign Board */}
          <div className="bg-gingham-pink border-2 border-white rounded-2xl px-8 py-2.5 shadow-md flex items-center justify-center -mt-1">
            <span className="text-pink-500 text-2xl filter drop-shadow">❤️</span>
          </div>
        </div>

        {/* White Card with Dashed Stitch Border (matching Image 1) */}
        <div className="w-full bg-white rounded-3xl p-6 pt-10 shadow-[0_15px_35px_-10px_rgba(2,132,199,0.2)] border-2 border-dashed border-sky-300 relative">
          {/* Yellow Star Sticker (top right) */}
          <div className="absolute -top-3 -right-3 text-amber-300 rotate-12 pointer-events-none">
            <div className="w-9 h-9 rounded-xl bg-amber-300 shadow-sm flex items-center justify-center text-white text-lg">
              ★
            </div>
          </div>

          {/* Heading */}
          <div className="text-center my-4">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
              {titlePrompt}{' '}
              <span className="relative inline-block text-pink-500">
                {subtitle}
                {/* Wavy Underline */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-2 text-sky-400"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,10 Q25,20 50,10 T100,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Input Box with Character Limit (0/15) */}
            <div className="relative">
              <input
                type="text"
                value={name}
                maxLength={maxLength}
                onChange={(e) => {
                  setName(e.target.value);
                  sounds.playPop();
                }}
                placeholder="name..."
                className="w-full h-14 pl-5 pr-16 bg-sky-50/60 text-slate-800 text-lg font-bold placeholder-sky-300 rounded-2xl border-2 border-sky-300 focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                autoFocus
              />
              {/* Character Limit Badge */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {name.length}/{maxLength}
              </div>
            </div>

            {/* Tactile 3D Continue Button */}
            <button
              type="submit"
              disabled={!name.trim()}
              className={`w-full h-14 rounded-2xl text-white font-display text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                name.trim()
                  ? 'btn-3d-blue active:translate-y-1'
                  : 'bg-slate-300 shadow-none cursor-not-allowed opacity-60'
              }`}
            >
              <span>continue</span>
              <span className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-sm font-black">
                ➔
              </span>
            </button>
          </form>

          {/* Blue Flower Sticker (bottom left) */}
          <div className="absolute -bottom-4 -left-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-sky-400 border-2 border-white shadow-md flex items-center justify-center text-amber-200 text-base font-black">
              ✿
            </div>
          </div>

          {/* Pink Heart Sticker (bottom right) */}
          <div className="absolute -bottom-3 -right-2 pointer-events-none rotate-12">
            <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white shadow-md flex items-center justify-center text-white text-xs">
              ❤️
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
