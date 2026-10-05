import React from 'react';

export const DoodleBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50 flex flex-col items-center justify-between">
      {/* Background Clouds and Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Cloud */}
        <div className="absolute -top-6 -left-10 w-48 h-28 bg-white/80 rounded-full blur-[1px] animate-drift-left opacity-90 shadow-sm" />
        <div className="absolute top-6 left-12 w-32 h-20 bg-white/70 rounded-full animate-drift-left opacity-90" />

        {/* Top Right Cloud */}
        <div className="absolute top-2 -right-8 w-56 h-28 bg-white/80 rounded-full blur-[1px] animate-drift-right opacity-90 shadow-sm" />
        <div className="absolute top-14 right-20 w-36 h-20 bg-white/75 rounded-full animate-drift-right opacity-90" />

        {/* Middle Clouds */}
        <div className="absolute top-1/3 -left-12 w-40 h-20 bg-white/60 rounded-full animate-drift-left" />
        <div className="absolute top-2/3 -right-10 w-48 h-24 bg-white/60 rounded-full animate-drift-right" />

        {/* Paper Airplane with Dotted Trail */}
        <div className="absolute top-16 right-10 md:right-1/4 opacity-85 pointer-events-none">
          <svg className="w-20 h-20 text-sky-400/80" viewBox="0 0 100 100" fill="none">
            {/* Dotted Trail */}
            <path
              d="M 5 80 Q 25 30 65 40 Q 75 42 70 25"
              stroke="#93c5fd"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              fill="none"
            />
            {/* Paper Airplane */}
            <g transform="translate(60, 10) rotate(15)">
              <polygon points="0,20 28,0 12,28" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" />
              <polygon points="12,28 14,14 28,0" fill="#e0f2fe" stroke="#60a5fa" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Doodle Stars & Sparkles */}
        <div className="absolute top-24 left-8 text-yellow-300 opacity-80 animate-pulse-subtle">
          <svg className="w-8 h-8 fill-yellow-200 stroke-yellow-400 stroke-2" viewBox="0 0 24 24">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>

        <div className="absolute top-1/2 left-4 text-sky-300 opacity-60">
          <svg className="w-6 h-6 stroke-sky-400 stroke-2 fill-none" viewBox="0 0 24 24">
            <path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="absolute top-3/4 right-6 text-pink-300 opacity-70">
          <svg className="w-7 h-7 fill-pink-200 stroke-pink-400 stroke-2" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {/* Main Content Container (Mobile-first responsive wrap) */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col min-h-screen px-4 py-4 sm:py-6">
        {children}
      </div>
    </div>
  );
};
