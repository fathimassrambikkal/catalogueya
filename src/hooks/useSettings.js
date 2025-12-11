import { useState, useEffect } from "react";
import { getSettings } from "../api";
import Cookies from "js-cookie";

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = Cookies.get("lang") || "en";
  const CACHE_KEY = `settings_${lang}`;

  useEffect(() => {
    let mounted = true;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setSettings(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await getSettings();

        // ✅ CORRECT PATH
        const data = res?.data?.data?.settings || {};

        if (mounted) {
          setSettings(data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();

    return () => { mounted = false };
  }, [lang]);

  return { settings, loading, error };
};
