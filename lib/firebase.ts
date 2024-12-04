"use client";

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  connectFirestoreEmulator,
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwCBdpCbeM0j2EahwSlok3cNVWv_THCJI",
  authDomain: "tempusbook-aa90d.firebaseapp.com",
  projectId: "tempusbook-aa90d",
  storageBucket: "tempusbook-aa90d.appspot.com",
  messagingSenderId: "458840005020",
  appId: "1:458840005020:web:0e38b41705a98e5e091059",
  measurementId: "G-3WWLMG80Z8"
};

let app;
let auth;
let db;

async function initializeFirebase() {
  if (!getApps().length) {
    try {
      // Initialize Firebase app
      app = initializeApp(firebaseConfig);

      // Initialize Auth with persistence
      auth = getAuth(app);
      await setPersistence(auth, browserLocalPersistence);

      // Initialize Firestore with settings for better offline support
      db = initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
        experimentalForceLongPolling: true,
      });

      // Enable offline persistence for Firestore
      if (typeof window !== 'undefined') {
        try {
          await enableIndexedDbPersistence(db);
        } catch (err: any) {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in first tab only');
          } else if (err.code === 'unimplemented') {
            console.warn('Browser doesn\'t support persistence');
          }
        }
      }

      // Only initialize emulators if explicitly enabled
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      if (!app) app = initializeApp(firebaseConfig);
      if (!auth) auth = getAuth(app);
      if (!db) {
        db = initializeFirestore(app, {
          cacheSizeBytes: CACHE_SIZE_UNLIMITED,
          experimentalForceLongPolling: true,
        });
      }
    }
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
}
//new line 

// Initialize Firebase immediately
initializeFirebase();

export { app, auth, db };