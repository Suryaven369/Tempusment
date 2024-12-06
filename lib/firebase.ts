"use client";

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator, 
  browserLocalPersistence, 
  setPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator
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

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);

// Set up persistence
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
}

// Set up emulators for development
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app, auth, db };