import { useState, useEffect } from "react";
import { getSettings } from "../api";
import Cookies from "js-cookie";
import {  warn, error } from "../utils/logger";

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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

    const parseImageArray = (value) => {
      if (!value) return [];

      try {
        if (Array.isArray(value)) {
          if (value.length === 1 && typeof value[0] === "string") {
            const match = value[0]
              .replace(/\\\//g, "/")
              .replace(/\\"/g, '"')
              .match(/\[.*\]/);

            if (match) {
              return JSON.parse(match[0]).map(normalizeUrl);
            }
          }
          return value;
        }

        if (typeof value === "string") {
          const clean = value.replace(/\\\//g, "/").replace(/\\"/g, '"');
          const match = clean.match(/\[.*\]/);
          if (match) {
            return JSON.parse(match[0]).map(normalizeUrl);
          }
          return [clean.replace(/\\/g, "")];
        }
      } catch (e) {
        warn("useSettings: failed to parse image array", value);
      }

      return [];
    };

    const normalizeUrl = (item) =>
      item.startsWith("http")
        ? item
        : `https://catalogueyanew.com.awu.zxu.temporary.site/${item.trim()}`;

    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        const raw = res?.data?.data?.settings || {};

        const imageFields = ["hero_backgrounds", "about_imgs", "partners_imgs"];
        const processed = {};

        Object.keys(raw).forEach((key) => {
          const value = raw[key];
          processed[key] = imageFields.includes(key)
            ? parseImageArray(value)
            : typeof value === "string"
            ? value.replace(/\\/g, "")
            : value;
        });

        if (mounted) {
          setSettings(processed);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(processed));
        }
      } catch (e) {
        error("useSettings: fetch failed", e);
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      mounted = false;
    };
  }, [lang]);

  return { settings, loading, error: err };
};
