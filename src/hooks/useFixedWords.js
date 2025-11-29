import { useState, useEffect } from 'react';
import { getFixedWords } from '../api';

// Cache for fixed words data
let fixedWordsCache = null;
let fixedWordsPromise = null;

export const useFixedWords = () => {
  const [fixedWords, setFixedWords] = useState(fixedWordsCache || {});
  const [loading, setLoading] = useState(!fixedWordsCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If already cached, use it immediately
    if (fixedWordsCache) {
      setFixedWords(fixedWordsCache);
      setLoading(false);
      return;
    }

    // If request is already in progress, wait for it
    if (fixedWordsPromise) {
      fixedWordsPromise.then(data => {
        setFixedWords(data);
        setLoading(false);
      }).catch(err => {
        setError(err.message);
        setLoading(false);
      });
      return;
    }

    // Make new request
    setLoading(true);
    fixedWordsPromise = getFixedWords()
      .then(response => {
        const fixedWordsData = response?.data?.data || {};
        fixedWordsCache = fixedWordsData; // Cache the data
        setFixedWords(fixedWordsData);
        setLoading(false);
        return fixedWordsData;
      })
      .catch(err => {
        console.error('Failed to fetch fixed words:', err);
        setError('Failed to load content');
        setLoading(false);
        return {};
      });

    return () => {
      // Cleanup if component unmounts
    };
  }, []);

  return { fixedWords, loading, error };
};