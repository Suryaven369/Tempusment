"use client";

import { useState, useEffect } from 'react';
import { goOnline, goOffline } from '@/lib/firebase-collections';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      goOnline();
    }

    function handleOffline() {
      setIsOnline(false);
      goOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}