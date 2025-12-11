import { useState, useEffect } from "react";
import { getFixedWords } from "../api";
import Cookies from "js-cookie";

export const useFixedWords = () => {
  const [fixedWords, setFixedWords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = Cookies.get("lang") || "en";
  const CACHE_KEY = `fixed_words_${lang}`;

  useEffect(() => {
    let mounted = true;

    // ✅ 1. Read cache first (instant UI)
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setFixedWords(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // ✅ 2. Fetch only if cache missing
    const fetchData = async () => {
      try {
        const res = await getFixedWords();
        const data = res?.data?.data || {};

        if (mounted) {
          setFixedWords(data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [lang]);

  return { fixedWords, loading, error };
};
