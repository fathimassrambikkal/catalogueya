import { useState, useEffect } from "react";
import { getSettings } from "../api";
import Cookies from "js-cookie";

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = Cookies.get("lang") || "en";

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        if (mounted) {
          setSettings(res?.data?.data || {});
        }
      } catch (err) {
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();

    // cleanup
    return () => {
      mounted = false;
    };
  }, [lang]);  // refetch when language changes

  return { settings, loading, error };
};
