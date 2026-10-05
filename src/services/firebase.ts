import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { PlayerAttempt, QuizData } from '../types/quiz';

export interface FirebaseConfigParams {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const FIREBASE_CONFIG_STORAGE_KEY = 'bestieblock_firebase_custom_config';

// Retrieve configuration from env vars or localStorage
export function getFirebaseConfig(): FirebaseConfigParams | null {
  // 1. Check user custom config saved in browser
  try {
    const custom = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed as FirebaseConfigParams;
      }
    }
  } catch {}

  // 2. Check Vite environment variables
  const env = import.meta.env;
  if (env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
}

export function saveCustomFirebaseConfig(config: FirebaseConfigParams | null) {
  if (config) {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  }
}

let firestoreInstance: Firestore | null = null;

export function getFirestoreDB(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    let app: FirebaseApp;
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase Firestore:', err);
    return null;
  }
}

export function isFirebaseActive(): boolean {
  return getFirebaseConfig() !== null;
}

// ---------------- Real-Time Firestore Operations ---------------- //

// Real-time snapshot listener on the leaderboard collection
export function subscribeToFirestoreLeaderboard(
  onUpdate: (attempts: PlayerAttempt[]) => void,
  onError?: (error: Error) => void
): Unsubscribe | null {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const attempts: PlayerAttempt[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          attempts.push({
            id: docSnap.id,
            playerName: data.playerName || 'Anonymous',
            score: Number(data.score) || 0,
            total: Number(data.total) || 5,
            percentage: Number(data.percentage) || 0,
            answers: data.answers || {},
            bonusThoughts: data.bonusThoughts,
            bonusTags: data.bonusTags,
            timestamp: Number(data.timestamp) || Date.now(),
          });
        });

        // Secondary sort by timestamp
        attempts.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
        onUpdate(attempts);
      },
      (error) => {
        console.warn('Firestore snapshot error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Firestore leaderboard:', err);
    return null;
  }
}

// Save player attempt to Firestore
export async function saveAttemptToFirestore(attempt: PlayerAttempt): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, 'leaderboard', attempt.id);
    await setDoc(docRef, {
      playerName: attempt.playerName,
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      answers: attempt.answers,
      bonusThoughts: attempt.bonusThoughts || null,
      bonusTags: attempt.bonusTags || null,
      timestamp: attempt.timestamp,
    });
    return true;
  } catch (err) {
    console.error('Failed to save attempt to Firestore:', err);
    return false;
  }
}

// Save quiz questions and configuration to Firestore
export async function saveQuizToFirestore(quiz: QuizData): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, 'quiz_config', 'anurag_quiz');
    await setDoc(docRef, quiz);
    return true;
  } catch (err) {
    console.error('Failed to save quiz to Firestore:', err);
    return false;
  }
}

// Fetch quiz from Firestore
export async function fetchQuizFromFirestore(): Promise<QuizData | null> {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const docRef = doc(db, 'quiz_config', 'anurag_quiz');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as QuizData;
    }
  } catch (err) {
    console.error('Failed to fetch quiz from Firestore:', err);
  }
  return null;
}

// Clear all leaderboard entries in Firestore
export async function clearFirestoreLeaderboard(): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const snap = await getDocs(collection(db, 'leaderboard'));
    const deletions = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletions);
    return true;
  } catch (err) {
    console.error('Failed to clear Firestore leaderboard:', err);
    return false;
  }
}
