"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserSettings, type UserSettings } from '@/lib/firebase-settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchSettings() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
        setError(null);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [user]);

  return { settings, loading, error, setSettings };
}