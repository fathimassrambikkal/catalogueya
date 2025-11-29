import { useState, useEffect } from 'react';
import { getSettings } from '../api';

// Cache for settings data
let settingsCache = null;
let settingsPromise = null;

export const useSettings = () => {
  const [settings, setSettings] = useState(settingsCache || {});
  const [loading, setLoading] = useState(!settingsCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If already cached, use it immediately
    if (settingsCache) {
      setSettings(settingsCache);
      setLoading(false);
      return;
    }

    // If request is already in progress, wait for it
    if (settingsPromise) {
      settingsPromise.then(data => {
        setSettings(data);
        setLoading(false);
      }).catch(err => {
        setError(err.message);
        setLoading(false);
      });
      return;
    }

    // Make new request
    setLoading(true);
    settingsPromise = getSettings()
      .then(response => {
        const settingsData = response?.data?.data || {};
        settingsCache = settingsData; // Cache the data
        setSettings(settingsData);
        setLoading(false);
        return settingsData;
      })
      .catch(err => {
        console.error('Failed to fetch settings:', err);
        setError('Failed to load settings');
        setLoading(false);
        return {};
      });

    return () => {
      // Cleanup if component unmounts
    };
  }, []);

  return { settings, loading, error };
};