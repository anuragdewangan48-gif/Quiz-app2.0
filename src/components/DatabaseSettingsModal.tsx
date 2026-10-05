import React, { useState } from 'react';
import {
  getFirebaseConfig,
  saveCustomFirebaseConfig,
  isFirebaseActive,
  FirebaseConfigParams,
} from '../services/firebase';
import { sounds } from '../utils/sound';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';

interface DatabaseSettingsModalProps {
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  onClose,
  onConfigChanged,
}) => {
  const currentConfig = getFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || '');

  const [jsonInput, setJsonInput] = useState('');
  const [inputMode, setInputMode] = useState<'fields' | 'json'>('fields');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const active = isFirebaseActive();

  const handleParseJson = () => {
    try {
      // Handle firebaseConfig = { ... } format or pure JSON
      let cleaned = jsonInput.trim();
      if (cleaned.startsWith('const firebaseConfig =')) {
        cleaned = cleaned.replace(/^const\s+firebaseConfig\s*=\s*/, '').replace(/;$/, '');
      }
      // If object keys are unquoted (standard JS object copy)
      cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      // replace single quotes with double quotes
      cleaned = cleaned.replace(/'/g, '"');

      const parsed = JSON.parse(cleaned);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.appId) setAppId(parsed.appId);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);

      setInputMode('fields');
      sounds.playChime();
      setSaveStatus('Config loaded! Click "Save Config" below.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      sounds.playBonk();
      setSaveStatus('Could not parse config snippet. Try pasting the values manually.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleSave = () => {
    if (!apiKey.trim() || !projectId.trim()) {
      sounds.playBonk();
      setSaveStatus('Please enter at least an API Key and Project ID.');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    const newConfig: FirebaseConfigParams = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      appId: appId.trim() || '1:12345:web:abcdef',
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
    };

    saveCustomFirebaseConfig(newConfig);
    sounds.playFanfare();
    setSaveStatus('Firebase Connected! Real-time sync is now active.');
    if (onConfigChanged) onConfigChanged();
    setTimeout(() => {
      onClose();
      // Reload page to reinitialize Firebase instance cleanly
      window.location.reload();
    }, 900);
  };

  const handleClear = () => {
    saveCustomFirebaseConfig(null);
    setApiKey('');
    setProjectId('');
    setAuthDomain('');
    setAppId('');
    setStorageBucket('');
    sounds.playBonk();
    setSaveStatus('Firebase config removed. Falling back to Vercel Serverless & Local.');
    if (onConfigChanged) onConfigChanged();
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const envSnippet = `# Add these to Vercel Project Settings -> Environment Variables:
VITE_FIREBASE_API_KEY="${apiKey || 'your-api-key'}"
VITE_FIREBASE_PROJECT_ID="${projectId || 'your-project-id'}"
VITE_FIREBASE_AUTH_DOMAIN="${authDomain || (projectId ? `${projectId}.firebaseapp.com` : 'your-project.firebaseapp.com')}"
VITE_FIREBASE_APP_ID="${appId || 'your-app-id'}"
VITE_FIREBASE_STORAGE_BUCKET="${storageBucket || (projectId ? `${projectId}.appspot.com` : 'your-project.appspot.com')}"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    sounds.playPop();
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border-2 border-sky-200 max-h-[92vh] flex flex-col relative overflow-hidden">
        {/* Pink Washi Tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-5 washi-tape-pink shadow-xs -rotate-1 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 pt-1 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-slate-800 text-lg leading-tight flex items-center gap-1.5">
                <span>Database & Sync</span>
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-[11px] font-bold text-sky-600">
                Vercel Serverless & Firebase Live Sync
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 text-xs">
          {/* Status Banner */}
          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
              active
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-sky-50/80 border-sky-200 text-slate-700'
            }`}
          >
            {active ? (
              <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <Cloud className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span>{active ? 'Firebase Firestore Active' : 'Vercel Serverless Ready'}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    active ? 'bg-emerald-200 text-emerald-800' : 'bg-sky-200 text-sky-800'
                  }`}
                >
                  {active ? 'Live Snapshot Sync' : 'REST + Polling'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                {active
                  ? 'Scores and leaderboard updates sync instantly across all devices without needing a persistent Node.js server.'
                  : 'The app uses Vercel serverless routes (/api/results, /api/leaderboard). For 0-server instant real-time sync, connect free Firebase Firestore below!'}
              </p>
            </div>
          </div>

          {/* Quick Tabs: Form vs Paste JSON */}
          <div className="flex items-center gap-2 border-b border-sky-100 pb-2">
            <button
              onClick={() => setInputMode('fields')}
              className={`px-3 py-1 rounded-xl font-display text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'fields'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Config Form
            </button>
            <button
              onClick={() => setInputMode('json')}
              className={`px-3 py-1 rounded-xl font-display text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'json'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Paste Firebase Snippet
            </button>
          </div>

          {inputMode === 'json' ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-600">
                Paste your Firebase Web App snippet from{' '}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-500 font-bold underline inline-flex items-center gap-0.5"
                >
                  Firebase Console <ExternalLink className="w-2.5 h-2.5" />
                </a>
                :
              </p>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "my-bestie-quiz",\n  authDomain: "my-bestie-quiz.firebaseapp.com",\n  appId: "1:..."\n};`}
                rows={5}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-none focus:border-sky-400"
              />
              <button
                onClick={handleParseJson}
                className="w-full py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-display font-bold text-xs shadow-xs cursor-pointer"
              >
                Auto-Fill Fields
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  Firebase Project ID *
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="e.g. my-quiz-app"
                  className="w-full h-8 px-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  Firebase API Key *
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full h-8 px-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  Auth Domain (Optional)
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="e.g. my-quiz-app.firebaseapp.com"
                  className="w-full h-8 px-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  App ID (Optional)
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="e.g. 1:123456789:web:abcdef"
                  className="w-full h-8 px-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSave}
                  className="flex-1 h-9 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-display font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Save & Activate</span>
                </button>

                {active && (
                  <button
                    onClick={handleClear}
                    className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feedback message */}
          {saveStatus && (
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          {/* Vercel Environment Variables Export */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-extrabold text-slate-700 text-[11px] flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-sky-500" />
                <span>Deploying to Vercel?</span>
              </span>
              <button
                onClick={handleCopyEnv}
                className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer shadow-2xs"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy .env snippet</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Paste these into your Vercel Project Settings → Environment Variables to have live sync active on every production deploy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-sky-100">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-full h-9 rounded-xl btn-3d-blue text-white font-display text-xs font-bold flex items-center justify-center cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
