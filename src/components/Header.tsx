import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage } from '../types/quiz';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { sounds } from '../utils/sound';
import { Volume2, VolumeX, Globe, Sparkles, Trophy, Edit3 } from 'lucide-react';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onHomeClick: () => void;
  onOpenLeaderboard?: () => void;
  onOpenEditQuiz?: () => void;
  leaderboardCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onHomeClick,
  onOpenLeaderboard,
  onOpenEditQuiz,
  leaderboardCount = 0,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.enabled = newState;
    if (newState) sounds.playPop();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="w-full flex items-center justify-between py-2 px-1 relative z-30 mb-2">
      {/* Brand Logo with Bubbly 3D font and sticker style */}
      <button
        onClick={() => {
          sounds.playPop();
          onHomeClick();
        }}
        className="flex items-center gap-1.5 group text-left transition-transform active:scale-95"
      >
        <div className="relative">
          {/* Main Logo Text with bubbly shadow */}
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-[0_3px_0_#0284c7] [text-shadow:_2px_2px_0_#0284c7,_-2px_-2px_0_#0284c7,_2px_-2px_0_#0284c7,_-2px_2px_0_#0284c7]">
            Bestie<span className="text-pink-400 [text-shadow:_2px_2px_0_#be185d,_-2px_-2px_0_#be185d,_2px_-2px_0_#be185d,_-2px_2px_0_#be185d]">Block</span>
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 absolute -top-1 -right-3 animate-pulse" />
        </div>
      </button>

      {/* Right Controls: Leaderboard + Sound Toggle + Language Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Leaderboard button */}
        {onOpenLeaderboard && (
          <button
            onClick={() => {
              sounds.playPop();
              onOpenLeaderboard();
            }}
            title="View Leaderboard"
            className="h-8 px-2 sm:px-2.5 rounded-full bg-white/95 shadow-xs border border-amber-200 hover:border-amber-300 flex items-center gap-1 text-xs font-bold text-slate-700 active:scale-90 transition-transform"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="hidden sm:inline">Ranks</span>
            {leaderboardCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-black">
                {leaderboardCount > 9 ? '9+' : leaderboardCount}
              </span>
            )}
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          aria-label={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className="w-8 h-8 rounded-full bg-white/90 shadow-xs border border-sky-100 flex items-center justify-center text-sky-600 hover:bg-white active:scale-90 transition-transform"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Language Selector (Pill button with Globe & Pink Badge matching Image 2) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              sounds.playPop();
              setLangMenuOpen(!langMenuOpen);
            }}
            className="flex items-center gap-1 py-1 px-2 rounded-full bg-white/95 shadow-xs border border-sky-200 hover:border-sky-300 text-xs font-bold text-slate-700 active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[11px]">{activeLangObj.code.toUpperCase()}</span>
            <span className="w-3.5 h-3.5 rounded-full bg-pink-400 text-white flex items-center justify-center text-[9px] font-bold">
              ▾
            </span>
          </button>

          {/* Language Dropdown Menu */}
          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-sky-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    sounds.playPop();
                    onLanguageChange(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-sky-50 transition-colors ${
                    currentLang === lang.code ? 'text-pink-600 bg-pink-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeLabel}</span>
                  </span>
                  {currentLang === lang.code && <span className="text-pink-500">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
