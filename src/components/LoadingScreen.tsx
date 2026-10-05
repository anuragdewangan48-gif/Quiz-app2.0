import React from 'react';
import { ASSETS } from '../assets/assetMap';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'loading...' }) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-8 relative">
      {/* Top Cute Character peek */}
      <div className="w-24 h-24 mb-4 relative animate-gentle-bounce">
        <img
          src={ASSETS.pandaMascot}
          alt="Bestie Mascot"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-full shadow-sm drop-shadow-md"
        />
      </div>

      {/* Sticky Note Card (matching Image 3) */}
      <div className="w-full max-w-xs relative bg-notebook-lines rounded-3xl p-8 pt-10 shadow-[0_12px_30px_-8px_rgba(2,132,199,0.22)] border-2 border-white/80">
        {/* Pink Washi Tape across top-left */}
        <div className="absolute -top-3.5 left-8 w-28 h-7 washi-tape-pink -rotate-3 z-10" />

        {/* Binder Ring Holes on the left */}
        <div className="absolute left-2.5 top-6 bottom-6 flex flex-col justify-around pointer-events-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-sky-100 border border-slate-300 shadow-inner" />
          ))}
        </div>

        {/* Content */}
        <div className="pl-4 flex flex-col items-center justify-center text-center py-4">
          <h2 className="font-display text-3xl font-extrabold text-slate-800 tracking-wide mb-5">
            {message}
          </h2>

          {/* Three Bouncing Pastel Dots */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-3.5 h-3.5 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Star Sticker (bottom left) */}
        <div className="absolute -bottom-3 left-4 text-sky-400 -rotate-12 pointer-events-none">
          <svg className="w-8 h-8 fill-sky-100 stroke-sky-400 stroke-2" viewBox="0 0 24 24">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>

        {/* Heart Sticker (bottom right) */}
        <div className="absolute -bottom-3 right-4 rotate-12 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center shadow-md">
            <span className="text-white text-sm">❤️</span>
          </div>
        </div>
      </div>
    </div>
  );
};
