import { useState, useEffect } from "react";
import { getFixedWords } from "../api";
import Cookies from "js-cookie";

export const useFixedWords = () => {
  const [fixedWords, setFixedWords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = Cookies.get("lang") || "en";

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await getFixedWords();
        if (mounted) {
          setFixedWords(res?.data?.data || {});
        }
      } catch (err) {
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    // cleanup
    return () => {
      mounted = false;
    };
  }, [lang]); // refetch when language changes

  return { fixedWords, loading, error };
};
