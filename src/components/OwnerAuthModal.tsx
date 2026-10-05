import React, { useState } from 'react';
import { OWNER_PASSCODE, setOwnerAuth } from '../utils/share';
import { sounds } from '../utils/sound';
import { Lock, Unlock, X, KeyRound, AlertCircle } from 'lucide-react';

interface OwnerAuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({ onSuccess, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === OWNER_PASSCODE.toLowerCase()) {
      sounds.playFanfare();
      setOwnerAuth(true);
      onSuccess();
    } else {
      sounds.playBonk();
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border-2 border-sky-200 relative">
        {/* Pink Washi Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape-pink shadow-xs -rotate-1 pointer-events-none" />

        <div className="flex items-center justify-between pb-2 border-b border-sky-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-display font-black text-slate-800 text-base">
              Owner Access
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Only Anurag can edit the quiz questions and answers. Enter your passcode to unlock editing:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="Enter passcode (anurag)..."
              autoFocus
              className="w-full h-10 px-3 bg-sky-50 font-display font-bold text-slate-800 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 focus:bg-white"
            />
            {error && (
              <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Incorrect passcode. Only Anurag can edit.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-2xl btn-3d-blue text-white font-display text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Edit Mode</span>
          </button>
        </form>
      </div>
    </div>
  );
};
